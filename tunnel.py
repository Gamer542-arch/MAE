import sys
import time
from pyngrok import ngrok

PORT = 8000

print(f"⚡ MAE Quick Tunnel")
print(f"   Forwarding to localhost:{PORT}")
print()

try:
    tunnel = ngrok.connect(PORT, "http")
    print(f"🌐 Public URL: {tunnel.public_url}")
    print(f"   Extensions: {tunnel.public_url}/extensions")
    print(f"   API Docs:   {tunnel.public_url}/docs")
    print()
    print("Press Ctrl+C to stop")
    
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\nStopping tunnel...")
    ngrok.kill()
    print("Done.")
except Exception as e:
    print(f"Error: {e}")
    print("Make sure ngrok is not blocked by your firewall")
