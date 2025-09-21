import os
import hashlib
import logging
import pandas as pd
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.schema import Document

CHROMA_DB_DIR = "vectorstore/chroma_db"
EXCEL_PATH = "insurance_qa_long.csv"
# Create vectorstore directory if not exists
os.makedirs(CHROMA_DB_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def get_text_hash(text: str) -> str:
    return hashlib.md5(text.encode("utf-8")).hexdigest()


if not os.path.exists(EXCEL_PATH):
    logger.error(f"Excel file not found: {EXCEL_PATH}")
    exit(1)

df = pd.read_csv(EXCEL_PATH)
logger.info(f"Loaded Excel with {len(df)} rows")

# Normalize country column
df["Country"] = df["Country"].astype(str).str.strip().str.title()

documents = []
for _, row in df.iterrows():
    content = str(row["Question"])
    metadata = {
        "Country": str(row.get("Country", "")),
        "Answer": str(row.get("Answer", "")),
        "Comment": str(row.get("Comment", "")),
        "hash": get_text_hash(content)
    }
    documents.append(Document(page_content=content, metadata=metadata))

logger.info(f"Prepared {len(documents)} documents with metadata")


embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
logger.info("Initialized HuggingFaceEmbeddings")


if os.path.exists(CHROMA_DB_DIR) and os.listdir(CHROMA_DB_DIR):
    db = Chroma(
        collection_name="insurance_qa",
        embedding_function=embeddings,
        persist_directory=CHROMA_DB_DIR,
    )
    logger.info("Loaded existing Chroma collection")

    # Remove duplicates
    existing_hashes = set()
    existing_docs = db._collection.get(include=["metadatas"]).get("metadatas", [])
    for meta in existing_docs:
        if isinstance(meta, dict) and "hash" in meta:
            existing_hashes.add(meta["hash"])

    logger.info(f"Existing document count: {len(existing_hashes)}")

    # Keep only new documents
    unique_docs = [doc for doc in documents if doc.metadata["hash"] not in existing_hashes]
    logger.info(f"{len(unique_docs)} new unique documents to add")

    if unique_docs:
        db.add_documents(unique_docs)
        db.persist()
        logger.info("Added and persisted new documents")
    else:
        logger.info("No new documents to add")
else:
    # Create new collection
    db = Chroma.from_documents(
        documents,
        embeddings,
        collection_name="insurance_qa",
        persist_directory=CHROMA_DB_DIR
    )
    logger.info(f"Created new Chroma collection with {len(documents)} documents")
