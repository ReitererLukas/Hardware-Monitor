import asyncio
import websockets
import json
import psutil
from sys import argv

async def monitor(websocket, path):
    while True:
        await websocket.send(json.dumps({
            "cpu": psutil.cpu_percent(),
            "memory": psutil.virtual_memory().percent,
            "disk": psutil.disk_usage("C:/").percent,
            "network": len(psutil.net_connections()),
            "pids": len(psutil.pids()),
        }))
        await asyncio.sleep(0.5)

async def main():
    async with websockets.serve(monitor, "localhost", argv[1]):
        await asyncio.Future()  # run forever

asyncio.run(main())