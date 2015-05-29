#!/usr/bin/env python
import os
import sys
import http.server
import socketserver

PORT = 8002


class HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            self.path = "/build/index.html"
        super().do_GET()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST')
        http.server.SimpleHTTPRequestHandler.end_headers(self)


def server(s_port):
    return socketserver.TCPServer(('', s_port), HTTPRequestHandler)

if __name__ == "__main__":
    port = PORT
    httpd = server(port)
    try:
        os.chdir('.')
        print("\Starting server at 127.0.0.1:" + str(port))
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n...shutting down http server")
        httpd.shutdown()
        sys.exit()
