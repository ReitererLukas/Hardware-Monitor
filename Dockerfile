FROM python:3.8.5

WORKDIR /server

RUN pip3 install psutil websockets

COPY server.py .

CMD ["python3","server.py"]

# docker build -t hardware-agent .