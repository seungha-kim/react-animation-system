import React from "react";
import ReactDOM from "react-dom";
import { delay } from "./utils/time";
import { withSystem } from "./System";

function App() {
  return (
    <div className="App">
      <div id="panel" />
      <div style={{ position: "relative", marginTop: "100px" }}>
        <Time />
      </div>
    </div>
  );
}

const Time = withSystem({
  panelId: "panel",
  autoPlay: true,
  sliders: [
    {
      name: "maxRadius",
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 50
    },
    {
      name: "amp",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 50
    }
  ],
  indices: [
    {
      name: "bigRow",
      delay: 150,
      num: 3
    },
    {
      name: "littleRow",
      delay: 100,
      num: 2
    },
    {
      name: "col",
      delay: 10,
      num: 40
    }
  ]
})(({ time, col, bigRow, littleRow, maxRadius, amp }) => {
  const period = Math.PI / 50;
  const localTime = delay(time / 10, 10 * col);
  const f = Math.sin(localTime * period) + period;
  const radius = (maxRadius * (1 - Math.cos(localTime / 100))) / 2;
  return (
    <div
      key={col}
      style={{
        display: "inline-block",
        position: "absolute",
        width: `${radius}px`,
        height: `${radius}px`,
        left: `${col * 10}px`,
        borderRadius: `${radius / 2}px`,
        backgroundColor: "red",
        top: `${bigRow * 40 + littleRow * 15 + f * amp}px`
      }}
    />
  );
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
