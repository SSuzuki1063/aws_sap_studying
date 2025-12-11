#!/usr/bin/env python3
import http.server
import socketserver
import os
from urllib.parse import unquote

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORSヘッダーを追加
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        # URLデコード
        self.path = unquote(self.path)
        print(f"リクエスト: {self.path}")
        super().do_GET()

if __name__ == "__main__":
    PORT = 8080
    # Use script directory as web root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"サーバーが起動しました: http://localhost:{PORT}/")
        print("Ctrl+C で停止します")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nサーバーを停止しています...")