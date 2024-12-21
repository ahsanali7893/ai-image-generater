"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const API_TOKEN = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY; // Ensure this variable is correctly defined in .env.local

  const handleSubmit = async () => {
    setLoading(true); // Show loader
    setResult(null); // Clear previous result
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell", // Using the text-to-image model
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: inputText, // The input text for image generation
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.blob();
      console.log("API Response:", data);

      const imageUrl = URL.createObjectURL(data);
      setResult(imageUrl);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">AI Image Generator</h1>

      <div className="w-full max-w-lg">
        <textarea
          className="w-full bg-white text-black border border-gray-300 rounded-lg p-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text..."
          rows={5}
        />
        <button
          className={`mt-4 w-full px-6 py-3 text-lg font-semibold rounded-lg shadow-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate Image"}
        </button>
      </div>

      <div className="w-full max-w-lg mt-8">
        <p className="text-lg font-medium">Result:</p>
        <div className="bg-white text-black rounded-lg p-4 mt-4 shadow-lg min-h-[120px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          ) : result ? (
            <div>
              <img
                src={result}
                alt="Generated Image"
                className="w-full h-auto rounded-lg"
              />
              <a
                href={result}
                download="generated-image.jpg"
                className="mt-4 inline-block text-lg font-semibold text-blue-500 hover:underline"
              >
                Download Image
              </a>
            </div>
          ) : (
            <p>Your generated image will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
