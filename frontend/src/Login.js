import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

function Login() {
  const [username, setUsername] = useState(""); // username
  const [password, setPassword] = useState(""); //password

  const navigate = useNavigate();

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // handler to send post request to backend server for user authentication
  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post("/users/login/", { username: username, password: password }, config)
      .then((resp) => {
        navigate("/room", {
          state: {
            user: resp.data,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <Row className="m-5">
        <Col lg={3}></Col>
        <Col className="pt-5 pb-5" lg={6}>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              lineHeight: "2.25rem",
              color: "#101928",
            }}
          >
            Log In
          </h2>
          <form onSubmit={(e) => submitHandler(e)}>
            <div className="form-group">
              <label htmlFor="exampleInputUsername">Username</label>
              <input
                className="form-control mb-2"
                type="name"
                id="exampleInputUsername"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputPassword">Password</label>
              <input
                className="form-control mb-2"
                type="password"
                id="exampleInputPassword"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn btn-primary mt-2" type="submit">
              Log In
            </button>
          </form>
        </Col>
        <Col lg={3}></Col>
      </Row>
    </div>
  );
}

export default Login;
