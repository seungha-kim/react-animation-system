import React from "react";
import ReactDOM from "react-dom";
import { WavingCircle, WavingDiv } from "./examples";

function App() {
  return (
    <div className="App">
      <div id="panel" />
      <div style={{ position: "relative", marginTop: "100px" }}>
        <WavingDiv />
      </div>
      <svg width="400" height="200">
        <WavingCircle width={400} height={200} />
      </svg>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
