#!/usr/bin/env python3
"""
Quick API key test script
"""
import os
from anthropic import Anthropic
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv("ANTHROPIC_API_KEY")
print(f"API Key (first 20 chars): {api_key[:20]}...")
print(f"API Key length: {len(api_key)}")

# Try to create a client
try:
    client = Anthropic(api_key=api_key)
    print("✓ Client created successfully")

    # Try different model names
    models_to_try = [
        "claude-3-5-sonnet-20241022",
        "claude-3-5-sonnet-20240620",
        "claude-3-opus-20240229",
        "claude-3-sonnet-20240229",
        "claude-3-haiku-20240307",
        "claude-2.1",
        "claude-2.0",
    ]

    print("\nTesting models...")
    for model in models_to_try:
        try:
            response = client.messages.create(
                model=model,
                max_tokens=10,
                messages=[{"role": "user", "content": "Hi"}]
            )
            print(f"✓ {model} - WORKS!")
            print(f"  Response: {response.content[0].text}")
            break
        except Exception as e:
            error_msg = str(e)
            if "not_found_error" in error_msg:
                print(f"✗ {model} - Not found")
            elif "authentication_error" in error_msg:
                print(f"✗ {model} - Auth error")
                print(f"  Error: {error_msg[:100]}")
                break
            else:
                print(f"✗ {model} - Error: {error_msg[:100]}")

except Exception as e:
    print(f"✗ Error creating client: {e}")
