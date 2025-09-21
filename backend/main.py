import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.schema import Document
from openai import OpenAI
import logging
from chroma_util import query_db

# ---------------- Environment Setup ----------------
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key not found. Please set it in .env")

# ---------------- Logging Setup ----------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)
logger = logging.getLogger("InsuranceQA_RAG")

# ---------------- FastAPI App ----------------
app = FastAPI(title="Insurance QA RAG Chatbot")

# ---------------- Global Variables ----------------
db: Chroma = None
embedding_model: HuggingFaceEmbeddings = None
llm_client: OpenAI = None
CHROMA_DB_DIR = "vectorstore/chroma_db"

# ---------------- Request Model ----------------
class ChatRequest(BaseModel):
    question: str
    country: Optional[str] = None

# ---------------- Startup Event ----------------
@app.on_event("startup")
def startup_event():
    global db, embedding_model, llm_client

    logger.info("Starting FastAPI application startup...")

    # Initialize embeddings
    logger.info("Initializing HuggingFace embeddings (CPU, telemetry off)...")
    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={"device": "cpu"}
    )
    logger.info("HuggingFace embeddings initialized successfully.")

    # Initialize Chroma
    logger.info(f"Loading Chroma collection from directory: {CHROMA_DB_DIR}...")
    db = Chroma(
        collection_name="insurance_qa",
        embedding_function=embedding_model,
        persist_directory=CHROMA_DB_DIR
    )
    logger.info("Chroma vector store loaded successfully.")

    # Initialize OpenAI client
    logger.info("Initializing OpenAI client...")
    llm_client = OpenAI(api_key=OPENAI_API_KEY)
    logger.info("OpenAI client initialized successfully.")

    logger.info("Startup complete. Application ready to accept requests.")


# ---------------- Helper Functions ----------------
def generate_answer(query: str, context_docs: List[Document]) -> str:
    logger.info(f"Generating answer for query: '{query}' with {len(context_docs)} context documents.")
    context_texts = [doc.page_content for doc in context_docs]
    logger.debug(f"Context texts:\n{context_texts}")

    prompt = f"""
    Use the following documents as context to answer the question.

    Context:
    {'\n\n'.join(context_texts)}

    Question: {query}
    Answer:
    """
    logger.info("Sending request to OpenAI LLM...")
    response = llm_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
    )
    answer_text = response.choices[0].message.content
    logger.info("Received response from OpenAI LLM.")
    logger.debug(f"Answer:\n{answer_text}")
    return answer_text


# ---------------- API Endpoints ----------------
@app.post("/chat")
def chat(req: ChatRequest):
    logger.info(f"Received chat request: question='{req.question}', country='{req.country}'")

    query = req.question
    country_filter = req.country

    # Retrieve documents
    docs: List[Document] = []
    if country_filter:
        logger.info(f"Querying Chroma DB with country filter: '{country_filter}'")
        results = query_db(db, query, country_filter, n_results=3)
        docs = [doc for doc, score in results]
        logger.info(f"Retrieved {len(docs)} documents with country filter.")
    else:
        logger.info("Querying Chroma DB without country filter (similarity search).")
        docs = db.similarity_search(query, k=3)
        logger.info(f"Retrieved {len(docs)} documents from similarity search.")

    if not docs:
        logger.warning("No relevant documents found for query.")
        return {"answer": "No relevant documents found for your query."}

    # Generate answer
    answer = generate_answer(query, docs)

    # Log metadata of retrieved docs
    for i, doc in enumerate(docs, start=1):
        logger.debug(f"Doc {i}: content='{doc.page_content[:100]}...', metadata={doc.metadata}")

    logger.info("Returning response to client.")
    return {
        "query": query,
        "retrieved_documents": [
            {"content": doc.page_content, "metadata": doc.metadata} for doc in docs
        ],
        "answer": answer,
    }