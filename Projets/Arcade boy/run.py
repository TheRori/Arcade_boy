import subprocess
import os
import threading

def run_esbuild():
    try:
        # Exécute la commande esbuild pour bundle le fichier game.js
        result = subprocess.run(
            ["esbuild", "main.js", "--bundle", "--outfile=build.js"],
            check=True,
            capture_output=True,
            text=True
        )
        print("esbuild output:", result.stdout)
    except subprocess.CalledProcessError as e:
        print("Error during esbuild:", e.stderr)
        raise

def start_http_server():
    try:
        # Démarre un serveur HTTP local sur le port 8000
        result = subprocess.run(
            ["python3", "-m", "http.server", "8000"],
            check=True,
            text=True
        )
        print("HTTP server output:", result.stdout)
    except subprocess.CalledProcessError as e:
        print("Error during HTTP server start:", e.stderr)
        raise

def start_http_server_in_thread():
    server_thread = threading.Thread(target=start_http_server)
    server_thread.daemon = True
    server_thread.start()

if __name__ == "__main__":
    # Assure que le script s'exécute dans le bon répertoire
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Exécute esbuild
    run_esbuild()
    
    # Démarre le serveur HTTP dans un thread séparé
    start_http_server_in_thread()
    
    # Empêche le script de se terminer immédiatement pour permettre au serveur de fonctionner
    print("Server is running at http://localhost:8000")
    try:
        while True:
            pass
    except KeyboardInterrupt:
        print("\nServer stopped.")
