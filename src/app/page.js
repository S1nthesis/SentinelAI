'use client'

import { useState } from 'react'

export default function Home() {

  // Keep track of the classification result and the model loading status.
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState(null);

  const classify = async (text) => {
    if (!text) return;
    if (ready === null) setReady(false);

    // Make a request to the /classify route on the server.
    const result = await fetch(`/classify2?text=${encodeURIComponent(text)}`);

    // If this is the first time we've made a request, set the ready flag
    if (!ready) setReady(true);

    const json = await result.json();
    setResult(json);
  };

  const handleSubmit = () => {
    // Trigger classification when the submit button is clicked
    const inputText = document.getElementById('textInput').value;
    classify(inputText);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-5xl font-bold mb-2 text-center">SentinelAI</h1>
      <h2 className="text-2xl mb-4 text-center">Enter text below to analyze sentiment</h2>
      <input
        id="textInput"
        type="text"
        className="w-full max-w-xs p-2 border border-gray-300 rounded mb-4 text-black"
        placeholder="Enter text here"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>

      <div className="mb-4"></div>

      {ready !== null && (
        <div className="bg-gray-100 p-2 rounded text-black">
          {(!ready || !result) ? (
            <p>Loading model... (only run once)</p>
          ) : (
            <div>
              <p className="font-semibold text-center">Sentiment Analysis Result:</p>
              <ul className="list-disc pl-4">
                {result.map((item, index) => (
                  <div key={index}>
                    <div>
                      <strong>Rating:</strong> <span>{item.label}</span>
                    </div>
                    <div>
                      <strong>Confidence:</strong> <span>{item.score}</span>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
