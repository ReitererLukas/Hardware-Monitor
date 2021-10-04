import asyncio
import websockets

async def hello():
    uri = "ws://localhost:6789"
    # connect to another websocket, which serves as a client
    async with websockets.connect(uri) as websocket:

        while True:
            # wait for answer of the server
            json = await websocket.recv()
            print(f"<<< {json}")

asyncio.run(hello())