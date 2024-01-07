import { useState, React } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

function Room() {
  const [room, setRoom] = useState(""); //room name

  const navigate = useNavigate();
  const location = useLocation();

  // handler to send room, username and usertoken to chat screen
  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/chat", {
      state: {
        user: location.state.user,
        room: room,
      },
    });
  };

  return (
    <div>
      <Row className="m-5">
        <Col lg={3}></Col>
        <Col className="pt-5 pb-5" lg={6}>
          <h2
            className="text-center"
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              lineHeight: "2.25rem",
              color: "#101928",
            }}
          >
            Create or Join Room
          </h2>
          <p
            className="mt-2 text-center"
            style={{
              fontSize: "1.0rem",
              fontWeight: "500",
              lineHeight: "1.5rem",
              color: "#667185",
            }}
          >
            You can create a room and share room name with a peer(s) to join.
            Room names must are case sensitive and must match for peering
            connections.
          </p>
          <form onSubmit={(e) => submitHandler(e)}>
            <div className="form-group">
              <label htmlFor="exampleInputRoom">Room Name</label>
              <input
                className="form-control mb-2"
                type="name"
                id="exampleInputRoom"
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>

            <button className="btn btn-primary mt-2" type="submit">
              Create
            </button>
          </form>
        </Col>
        <Col lg={3}></Col>
      </Row>
    </div>
  );
}

export default Room;
