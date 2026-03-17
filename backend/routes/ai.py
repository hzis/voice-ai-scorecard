"""AI generation endpoint with streaming support."""

import os

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from openai import OpenAI
from pydantic import BaseModel

router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class GenerateRequest(BaseModel):
    prompt: str
    system_prompt: str = "You are a helpful assistant."
    model: str = "gpt-4o-mini"


@router.post("/generate")
async def generate(req: GenerateRequest):
    stream = client.chat.completions.create(
        model=req.model,
        messages=[
            {"role": "system", "content": req.system_prompt},
            {"role": "user", "content": req.prompt},
        ],
        stream=True,
    )

    def event_stream():
        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content

    return StreamingResponse(event_stream(), media_type="text/plain")
