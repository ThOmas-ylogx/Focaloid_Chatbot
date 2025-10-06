import os
import logging
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

CHROMA_DB_DIR = "vectorstore/chroma_db"

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

if not os.path.exists(CHROMA_DB_DIR) or not os.listdir(CHROMA_DB_DIR):
    logger.error("No existing Chroma vector store found.")
    exit(1)

logger.info("Loaded Chroma vector store successfully.")

def query_db(db, question, country, n_results=3):

    """
    Query the vector store with a compulsory country filter.
    """
    # Create the filter for Chroma / vector store
    where_filter = {"Country": country}

    # Run similarity search with score, passing the metadata filter
    results = db.similarity_search_with_score(question, n_results, filter=where_filter)

    # Print results
    for i, (doc, score) in enumerate(results, start=1):
        print(f"\nResult {i}:")
        print(f"Question: {doc.page_content}")
        print(f"Metadata: {doc.metadata}")
        print(f"Score: {score}")
        print("-" * 50)
    
    return results

# Example usage

if __name__ == "__main__":
    user_question = "Are there any Tariffs that you must apply for a specific Line of Business or cover?"
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    db = Chroma(
        collection_name="insurance_qa",
        embedding_function=embeddings,
        persist_directory=CHROMA_DB_DIR
    )
    query_db(db, user_question, country="Nigeria")
