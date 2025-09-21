# Focaloid Insurance QA Chatbot 

## Frontend


## Backend

This backend provides a FastAPI-based API for a country-aware insurance chatbot. It uses a Chroma vector database for retrieval-augmented generation (RAG) and integrates with OpenAI for answer generation. The knowledge base is built from insurance Q&A data for multiple countries.

---

## Folder Structure

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo-url>
cd Focaloid_Chatbot/backend
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables(if required)

### 4. Run the Application

```bash
uvicorn main:app --reload
```
