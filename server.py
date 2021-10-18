import asyncio
import websockets
import json
import psutil
import os
from platform import system


async def monitor(websocket, path):
    while True:
        await websocket.send(json.dumps({
            "cpu": psutil.cpu_percent(),
            "memory": psutil.virtual_memory().percent,
            "disk": psutil.disk_usage("C:/" if system() == "Windows" else "/").percent,
            "network": len(psutil.net_connections()),
            "pids": len(psutil.pids()),
        }))
        await asyncio.sleep(0.5)

async def main():
    port = os.getenv('PORT', '6789')
    async with websockets.serve(monitor, "0.0.0.0", port):
        await asyncio.Future()  # run forever

asyncio.run(main())