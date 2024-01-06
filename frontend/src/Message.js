import React from "react";
import { Alert } from "react-bootstrap";

function Message({ variant, style, children }) {
  return (
    <Alert variant={variant} style={style} className="">
      {children}
    </Alert>
  );
}

export default Message;
