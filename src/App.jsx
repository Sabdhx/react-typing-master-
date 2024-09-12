import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [time, setTime] = useState(60);
  const [intervalId, setIntervalId] = useState(null);
  const [input, setInput] = useState("");
  const [color, setColor] = useState([]);
  const [incorrect, setIncorrect] = useState(0);
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://baconipsum.com/api/?type=meat-and-filler");
        setParagraphs(res.data[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTime = () => {
    if (intervalId) return;

    const id = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setIntervalId(null);
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);

    setIntervalId(id);
  };

  const onchangeHandler = (e) => {
    let incorrectWords = 0;
    let newColor = [];

    let value = e.target.value;
    setInput(value);

    for (let i = 0; i < value.length; i++) {
      if (value[i] === paragraphs[i]) {
        newColor[i] = "bg-green-500";
      } else {
        incorrectWords++;
        newColor[i] = "bg-red-500";
      }
    }

    setColor(newColor);
    setIncorrect(incorrectWords);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-8 text-center">Typing Master</h1>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg mb-6 hover:bg-blue-700 transition duration-300"
            onClick={handleTime}
          >
            Start the game
          </button>
          <p className="bg-red-500 text-white px-4 py-2 rounded-lg mb-6">
            Incorrect Words: {incorrect}
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
            <p className="text-lg leading-relaxed mb-6">
              {paragraphs?.split("").map((char, index) => (
                <span key={index} className={color[index]}>
                  {char}
                </span>
              ))}
            </p>
            <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={onchangeHandler}
              disabled={time === 60 || time === 0}
            />
          </div>
          <div className="text-2xl font-bold mt-6">Time left: {time} sec</div>
          <button
            className="bg-gray-500 py-3 px-5 mt-3 rounded-lg text-white cursor-pointer"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </>
      )}
    </div>
  );
}

export default App;