"""
Transcorp Hilton Abuja AI Concierge Chatbot - Main Application
"""

import os
from typing import List, Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from anthropic import Anthropic
from dotenv import load_dotenv

from system_prompt import SYSTEM_PROMPT

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Transcorp Hilton Abuja AI Concierge",
    description="AI-powered virtual concierge for Transcorp Hilton Abuja",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Anthropic client
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Configuration
MODEL_NAME = os.getenv("MODEL_NAME", "claude-3-5-sonnet-20241022")
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "4096"))
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))


# Pydantic models
class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    session_id: Optional[str] = None
    timestamp: str


# In-memory conversation storage (in production, use a database)
conversations = {}


@app.get("/")
async def read_root():
    """Serve the main chatbot interface"""
    return FileResponse("static/index.html")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Transcorp Hilton Abuja AI Concierge",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process chat messages and return AI response
    """
    try:
        # Prepare messages for Claude API
        messages_for_api = []

        # Add conversation history
        for msg in request.messages:
            messages_for_api.append({
                "role": msg.role,
                "content": msg.content
            })

        # Call Claude API
        response = anthropic_client.messages.create(
            model=MODEL_NAME,
            max_tokens=MAX_TOKENS,
            temperature=TEMPERATURE,
            system=SYSTEM_PROMPT,
            messages=messages_for_api
        )

        # Extract the response text
        response_text = response.content[0].text

        # Store conversation if session_id provided
        if request.session_id:
            if request.session_id not in conversations:
                conversations[request.session_id] = []
            conversations[request.session_id].extend(request.messages)
            conversations[request.session_id].append({
                "role": "assistant",
                "content": response_text
            })

        return ChatResponse(
            response=response_text,
            session_id=request.session_id,
            timestamp=datetime.utcnow().isoformat()
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing your request: {str(e)}"
        )


@app.get("/conversation/{session_id}")
async def get_conversation(session_id: str):
    """
    Retrieve conversation history for a session
    """
    if session_id not in conversations:
        raise HTTPException(status_code=404, detail="Session not found")

    return {
        "session_id": session_id,
        "messages": conversations[session_id],
        "message_count": len(conversations[session_id])
    }


@app.delete("/conversation/{session_id}")
async def clear_conversation(session_id: str):
    """
    Clear conversation history for a session
    """
    if session_id in conversations:
        del conversations[session_id]
        return {"message": "Conversation cleared successfully"}

    raise HTTPException(status_code=404, detail="Session not found")


# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host=host, port=port)
