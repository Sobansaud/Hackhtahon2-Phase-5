import asyncio
import os
from app.services.chatbot import ChatbotService
from app.core.config import settings

async def verify_chatbot():
    print(f"Testing Chatbot with model: command-r-08-2024")
    print(f"API Key start: {settings.COHERE_API_KEY[:5]}...")
    
    service = ChatbotService()
    if not service.co:
        print("FAILED: Cohere client not initialized.")
        return

    # test a simple message (bypass DB for pure service test if needed, 
    # but here we just want to see if the client can talk to Cohere)
    try:
        response = service.co.chat(
            message="Hi, are you working?",
            model="command-r-08-2024"
        )
        print("\nSUCCESS! Chatbot response:")
        print(response.text)
    except Exception as e:
        print(f"\nFAILED: {str(e)}")

if __name__ == "__main__":
    # Add project root to path so we can import app
    import sys
    sys.path.append(os.getcwd())
    asyncio.run(verify_chatbot())
