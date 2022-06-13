import { useState } from "react";

export default function useVisualMode(initial) {
  // state declarations
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    // when replace isn't true copy the history array and add the current mode to the end 
    if (!replace) {
      setHistory([...history, mode]);
    }
    // otherwise when replace is true, set the mode
    setMode(mode);
  }

  function back() {
    // checking if more than 2 elements in history
    if (history.length < 2) {
      return;
    }
    // creating a copy of history
    let historyCopy = [...history];
    // removing the last element in history array
    historyCopy.pop();

    // setting history as the copy of history
    setHistory(historyCopy);

    // setting the mode as the last element in historyCopy
    setMode(historyCopy[historyCopy.length - 1]);
  }

  return {
    mode,
    transition,
    history,
    back,
  };
}
