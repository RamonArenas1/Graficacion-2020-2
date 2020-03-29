import http.server
import socketserver

<<<<<<< HEAD:Practica03/server.py
PORT = 8000
=======
PORT = 8082
>>>>>>> 70d603220dcdc77021889e7228cd76bc3867ae04:Proyecto1/src/P3/Class/server.py
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()