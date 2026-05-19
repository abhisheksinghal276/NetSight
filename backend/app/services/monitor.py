import socket
import time


def check_server(ip, port):

    start = time.time()

    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        sock.settimeout(3)

        result = sock.connect_ex((ip, port))

        latency = int((time.time() - start) * 1000)

        sock.close()

        if result == 0:
            return {
                "status": "up",
                "latency": latency
            }

        return {
            "status": "down",
            "latency": latency
        }

    except Exception:
        return {
            "status": "down",
            "latency": 0
        }