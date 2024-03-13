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
    const result = await fetch(`/classify?text=${encodeURIComponent(text)}`);

    // If this is the first time we've made a request, set the ready flag
    if (!ready) setReady(true);

    const json = await result.json();
    setResult(json);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-5xl font-bold mb-2 text-center">SentinelAI</h1>
      <h2 className="text-2xl mb-4 text-center">Enter text below to analyze sentiment</h2>
      <input
        type="text"
        className="w-full max-w-xs p-2 border border-gray-300 rounded mb-4 text-black"
        placeholder="Enter text here"
        onInput={e => {
          classify(e.target.value);
        }}
      />

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