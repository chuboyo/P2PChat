import React, { useState, useEffect, useCallback } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Badge } from "react-bootstrap";
import Message from "./Message";
import { IoCheckmarkDone } from "react-icons/io5";

function Chat() {
  const [socket, setSocket] = useState(null); // chat web socket state
  const [readReceiptsSocket, setReadReceiptsSocket] = useState(null); //read receipts web socket state
  const [message, setMessage] = useState(""); // input message state
  const [messages, setMessages] = useState([]); // web socket messages state
  const [unreadMessages, setUnreadMessages] = useState([]); // unread messages state
  const [isOpen, setIsOpen] = useState(false); // chat room open/close state

  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(
    location.state ? location.state.user.user : ""
  ); // username
  const [token, setToken] = useState(
    location.state ? location.state.user.token : ""
  ); // user token
  const room = location.state ? location.state.room : ""; // room name

  // handler to trigger read receipts socket to emit read message ids
  const readHandler = useCallback(
    (ids) => {
      if (readReceiptsSocket) {
        const data = {
          ids: ids,
        };
        readReceiptsSocket.send(JSON.stringify(data));
      }
    },
    [readReceiptsSocket]
  );

  // handler to mark messages as read
  const markReadHandler = useCallback(
    (ids) => {
      const readMessages = messages.filter((message) => {
        return ids.some((id) => {
          return id === message.id;
        });
      });
      readMessages.map((message) => (message.is_read = true));
    },
    [messages]
  );

  useEffect(() => {
    // connect to chat web socket
    const newSocket = new W3CWebSocket(
      `ws://127.0.0.1:8000/ws/chat/?token=${token}&room=${room}`
    );
    setSocket(newSocket);

    // connect to read receipts web socket
    const newReadReceiptsSocket = new W3CWebSocket(
      `ws://127.0.0.1:8000/ws/read/?token=${token}&room=${room}`
    );
    setReadReceiptsSocket(newReadReceiptsSocket);

    newSocket.onopen = () => console.log("Chat WebSocket connected");
    newSocket.onclose = () => console.log("Chat WebSocket disconnected");

    newReadReceiptsSocket.onopen = () =>
      console.log("Read receipts WebSocket connected");
    newReadReceiptsSocket.onclose = () =>
      console.log("Read receipts WebSocket disconnected");

    // Clean up the WebSocket connections when the component unmounts
    return () => {
      newSocket.close();
      newReadReceiptsSocket.close();
    };
  }, [username, token, room]);

  useEffect(() => {
    if (socket && isOpen) {
      // if chat room dropdown is open, onmessage setMessages with web socket data,
      // call readHandler to read message if message was sent by another peer
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
        if (data.username !== username) {
          readHandler([data.id]);
        }
      };
    } else if (socket && !isOpen) {
      // if chat room dropdown is closed, onmessage setMessages with web socket data,
      // setUnreadMessages with web socket data
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
        setUnreadMessages((prevMessages) => [...prevMessages, data]);
      };
    }

    if (readReceiptsSocket) {
      // onmessage event from read receipt socket, get data and pass to markReadHandler
      // to mark message(s) as read.
      readReceiptsSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        markReadHandler(data.message);
      };
    }
  }, [
    socket,
    messages,
    readReceiptsSocket,
    isOpen,
    username,
    markReadHandler,
    readHandler,
  ]);

  // handler to open/close chat room drop down,
  // on chatroom dropdown open call readHandler to read unread messages
  const openHandler = (e) => {
    e.preventDefault();
    if (!isOpen) {
      const ids = unreadMessages
        .filter((unread) => unread.username !== username)
        .map((unread) => {
          return unread.id;
        });
      readHandler(ids);
    }

    setIsOpen(!isOpen);
    setUnreadMessages([]);
  };

  // handler to emit message to chat socket on submit
  const submitHandler = (event) => {
    event.preventDefault();
    if (message && socket) {
      const data = {
        message: message,
        username: username,
      };
      socket.send(JSON.stringify(data));
      setMessage("");
    }
  };

  // handler to log user out and discard tokens
  const logoutHandler = (e) => {
    e.preventDefault();
    setUsername("");
    setToken("");
  };

  return (
    <div>
      <h2
        className="mt-4 mb-2 text-center"
        style={{
          fontSize: "1.75rem",
          fontWeight: "700",
          lineHeight: "2.25rem",
          color: "#101928",
        }}
      >
        P2P Chat
      </h2>
      {username && token && room ? (
        <div
          className="card mt-4"
          style={{
            boxShadow: "none",
            border: "0.0625rem solid #E4E7EC",
            borderBottom: "none",
          }}
        >
          <div
            style={{
              background: "#F9FAFB",
              boxShadow: "none",
              borderRadius: "0.5rem 0.5rem 0rem 0rem",
            }}
          >
            <div
              className="p-3 border-bottom d-flex justify-content-between"
              onClick={openHandler}
            >
              <h6
                className="font-weight-bold"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  lineHeight: "1.5rem",
                  color: "#001633",
                }}
              >
                Chat Room {!isOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
              </h6>
              {!isOpen && <Badge bg="info">{unreadMessages.length}</Badge>}
            </div>
          </div>

          {isOpen && (
            <div className="border-bottom">
              <div>
                <div className="p-3">
                  <div className="chat-container">
                    <div className="message-container">
                      {messages.map((message) => (
                        <div key={message.id} className="message">
                          {message.username === username ? (
                            <div className="me-5">
                              <Message
                                style={{
                                  backgroundColor: "#F7F5FF",
                                  color: "#6941C6",
                                }}
                              >
                                <h6>{message.username}:</h6>
                                <p>{message.message}</p>

                                {message.is_read === false ? (
                                  <p>
                                    Unread{" "}
                                    <IoCheckmarkDone
                                      style={{
                                        color: "black",
                                      }}
                                    />
                                  </p>
                                ) : (
                                  <p
                                    style={{
                                      color: "#6941C6",
                                    }}
                                  >
                                    Read{" "}
                                    <IoCheckmarkDone
                                      style={{
                                        color: "blue",
                                      }}
                                    />
                                  </p>
                                )}
                              </Message>
                            </div>
                          ) : (
                            <div className="ms-5">
                              <Message variant="info">
                                <h6>{message.username}:</h6>
                                <p>{message.message}</p>
                              </Message>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <form onSubmit={submitHandler}>
                      <input
                        className="form-control mb-2"
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                      />
                      <button className="btn btn-primary mt-2" type="submit">
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-5 text-center">
            <button className="btn btn-danger" onClick={logoutHandler}>
              Log Out
            </button>
          </div>
        </div>
      ) : (
        <div className="m-5 pt-5 pb-5 text-center">
          You need to Login
          <div>
            <button
              className="btn btn-primary mt-2"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Chat;
