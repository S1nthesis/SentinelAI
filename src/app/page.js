'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export default function Home() {

  // Keep track of the classification result and the model loading status.
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState(null);

  // Create a reference to the worker object.
  const worker = useRef(null);

  // We use the `useEffect` hook to set up the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'initiate':
          setReady(false);
          break;
        case 'ready':
          setReady(true);
          break;
        case 'complete':
          setResult(e.data.output[0])
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });

  const classify = useCallback((text) => {
    if (worker.current) {
      worker.current.postMessage({ text });
    }
  }, []);

  const handleSubmit = () => {
    // Trigger classification when the submit button is clicked
    const inputText = document.getElementById('textInput').value;
    classify(inputText);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-5xl font-bold mb-2 text-center animated-gradient">SentinelAI</h1>
      <h2 className="text-2xl mb-4 text-center">Enter text below to analyze sentiment</h2>
      <div className="flex mb-4">
        <input
          id="textInput"
          type="text"
          className="w-full max-w-xs p-2 border border-gray-300 rounded mr-2 text-black"
          placeholder="Enter text here"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </div>

      {ready !== null && (
        <div className="bg-gray-100 p-2 rounded text-black" style={{ maxWidth: '500px', width: '80vw' }}>
          {(!ready || !result) ? (
            <p>Loading model... (only run once)</p>
          ) : (
            <div>
              <p className="font-semibold text-center">Sentiment Analysis Result:</p>
              <div className="border border-gray-300 rounded-md p-4">
                <p className="text-sm">Rating: {result.label}</p>
                <p className="text-sm">Confidence: {(result.score * 100).toFixed(2)}%</p>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}