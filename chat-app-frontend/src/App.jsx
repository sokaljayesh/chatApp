import React from "react";
import Routing from "./Components/Routing";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import ChatProvider from "./ChatProvider";


export default function App() {
  return (
    <div className="App">
      <ChatProvider>
        <Routing />
      </ChatProvider>
    </div>
  );
}
