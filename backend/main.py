import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# ---------------- CORS Configuration ----------------
# Get allowed origins from environment variable or use defaults
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

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
    newline_separator = '\n\n'  # Use newline separator instead of \n\n 
    prompt = f"""
    Use the following documents as context to answer the question.

    Context:
    {newline_separator.join(context_texts)}

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
@app.get("/")
def root():
    return {"status": "ok", "message": "Insurance QA RAG Chatbot API is running"}

@app.get("/health")
def health():
    return {"status": "healthy", "db_loaded": db is not None, "llm_ready": llm_client is not None}

# @app.post("/chat")
# def chat(req: ChatRequest):
#     logger.info(f"Received chat request: question='{req.question}', country='{req.country}'")

#     query = req.question
#     country_filter = req.country

#     # Retrieve documents
#     if country_filter:
#         logger.info(f"Querying Chroma DB with country filter: '{country_filter}'")
#         results = query_db(db, query, country_filter, n_results=3)
#         docs = [doc for doc, score in results]
#         logger.info(f"Retrieved {len(docs)} documents with country filter.")
#     else:
#         logger.info("Querying Chroma DB without country filter (similarity search).")
#         results = db.similarity_search_with_score(query, k=3)
#         docs = [doc for doc, _ in results]
#         logger.info(f"Retrieved {len(docs)} documents from similarity search.")

#     if not docs:
#         logger.warning("No relevant documents found for query.")
#         return {"answer": "No relevant documents found for your query."}

#     # Get the top match (lowest distance = best match)
#     top_doc = docs[0]
#     metadata = top_doc.metadata or {}

#     # Extract answer and comment fields
#     answer = (metadata.get("Answer") or "").strip()
#     comment = (metadata.get("Comment") or "").strip()

#     # Clean 'nan' or empty comments
#     if comment.lower() in ["nan", "none", "null", ""]:
#         comment = ""

#     # Merge comment with answer if available
#     if answer and comment:
#         final_answer = f"{answer}. {comment}"
#     else:
#         final_answer = "Answer not available in database."

#     logger.info(f"Returning combined answer: {final_answer}")

#     return {
#         "query": query,
#         "country": country_filter,
#         "answer": final_answer,
#         "source_metadata": metadata
#     }

def interpret_answer_with_gpt(question: str, answer: str, comment: str) -> str:
    """
    Use GPT to interpret and combine the extracted 'Answer' and 'Comment'
    fields into a coherent, user-friendly final answer.
    """
    if not answer and not comment:
        return "Answer not available in database."

    prompt = f"""
    You are an insurance domain assistant. 
    The user asked: "{question}"

    Below is the retrieved information from the database:
    - Answer: {answer or "N/A"}
    - Comment: {comment or "N/A"}

    Combine and interpret this information into a clear, natural, and helpful response for the user. 
    If the comment adds clarification, merge it smoothly into the answer. 
    Avoid repeating or using placeholder words like 'I don't have the answer for it kindly contact office'.
    Answer in a professional, concise tone.
    """

    logger.info("Sending interpretation request to GPT...")

    response = llm_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
    )

    final_text = response.choices[0].message.content.strip()
    logger.info("GPT interpretation completed successfully.")
    return final_text


@app.post("/chat")
def chat(req: ChatRequest):
    logger.info(f"Received chat request: question='{req.question}', country='{req.country}'")

    query = req.question
    country_filter = req.country

    # Step 1: Retrieve relevant documents
    if country_filter:
        logger.info(f"Querying Chroma DB with country filter: '{country_filter}'")
        results = query_db(db, query, country_filter, n_results=3)
        docs = [doc for doc, score in results]
    else:
        logger.info("Querying Chroma DB without country filter (similarity search).")
        results = db.similarity_search_with_score(query, k=3)
        docs = [doc for doc, _ in results]

    if not docs:
        return {"answer": "No relevant documents found for your query."}

    # Step 2: Extract fields from top document
    top_doc = docs[0]
    metadata = top_doc.metadata or {}

    answer = (metadata.get("Answer") or "").strip()
    comment = (metadata.get("Comment") or "").strip()

    # Clean 'nan', 'none', etc.
    if comment.lower() in ["nan", "none", "null", ""]:
        comment = ""
    if answer.lower() in ["nan", "none", "null", ""]:
        answer = ""

    # Step 3: Use GPT to interpret and combine
    final_answer = interpret_answer_with_gpt(query, answer, comment)

    return {
        "query": query,
        "country": country_filter,
        "answer": final_answer,
        "raw_answer": answer,
        "raw_comment": comment,
        "source_metadata": metadata,
    }
