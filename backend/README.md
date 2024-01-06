P2PChat BACKEND

This is the backend of a real time peer to peer messaging application developed using web sockets and django rest framework.
The application is containerized using docker and requires docker and docker compose to run.

To Run this application follow the steps below:

1. Make sure to cd into the backend directory

2. Run <docker-compose up --build> to build and start the application container.

3. You can Navigate to the following endpoints once the server is running:

   - http://127.0.0.1:8000/api/v1/users/ => This endpoint accepts post requests for user registration.
     Your request body should contain the following fields - username, email, password.

   - http://127.0.0.1:8000/api/v1/users/login/ => This endpoint accepts post requests to log in users.
     Your request body should contain the following fields - username, password.

   The api also has additional web socket endpoints for real time peer to peer chats:

   - ws://127.0.0.1:8000/ws/chat/

   - ws://127.0.0.1:8000/ws/read/

ENJOY !!!!!!
