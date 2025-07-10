#!/usr/bin/env python3
"""
Simple HTTP server for serving the live TV streaming website
"""
import http.server
import socketserver
import os
import webbrowser
from urllib.parse import urlparse

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for HLS streaming
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Cache control for better streaming
        if self.path.endswith('.m3u8') or self.path.endswith('.ts'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def start_server(port=8000):
    """Start the HTTP server"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("0.0.0.0", port), CustomHTTPRequestHandler) as httpd:
        print(f"Serving Kenyan Live TV at http://0.0.0.0:{port}")
        print(f"Live TV page: http://0.0.0.0:{port}/live-tv.html")
        print("Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    start_server()