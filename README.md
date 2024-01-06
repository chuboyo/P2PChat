P2P CHAT

This is the official repo for a real time peer to peer messaging application. The application was built using Django for the backend API and React for the frontend.
The backend API exposes endpoints for connecting to web socket consumers and for user authentication.
The frontend provides an easy to navigate interface to demo the application.

To run code from this repository follow the instructions below:

1. Start the backend server:

   - cd into <backend> directory using the command <cd backend/>

   - Start docker container using <docker-compose up --build>

2. On a different terminal window, start the frontend server:

   - cd into <frontend> directory using the command <cd frontend/>

   - Start the development server by running <npm start>

3. On a web browser, navigate to <localhost:3000/>

   - Register a user and Login

   - Repeat the process on another window

   - Enjoy your real time peer to peer messaging.

   - Other frontend urls:

     - <localhost:3000/login> => user login

     - <localhost:3000/chat> => chat room

REGARDS!!!!!!!
