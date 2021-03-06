import React, { useEffect } from "react";
import "./App.css";
import Task1 from "./task1/scene";
import Task2 from "./task2/scene";
import Task3 from "./task3/scene";
import Task4 from "./task4/scene";

function App() {
  useEffect(() => {
    Task1.init(document.getElementById("task1"), 0.5);
    Task2.init(document.getElementById("task2"), 0.5);
    Task3.init(document.getElementById("task3"), 0.5);
    Task4.init(document.getElementById("task4"), 0.5);
  }, []);

  return (
    <div className="Tasks">
      <div id="task1"> </div>
      <div id="task2"> </div>
      <div id="task3"> </div>
      <div id="task4"> </div>
    </div>
  );
}

export default App;
