export default function CameraFeed({ setEmotion }) {
  return (
    <div className="flex flex-col gap-3">

      <button
        onClick={() => setEmotion("happy")}
        className="bg-green-600 px-3 py-2 rounded hover:bg-green-500"
      >
        Happy
      </button>

      <button
        onClick={() => setEmotion("sad")}
        className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-500"
      >
        Sad
      </button>

      <button
        onClick={() => setEmotion("angry")}
        className="bg-red-600 px-3 py-2 rounded hover:bg-red-500"
      >
        Angry
      </button>

      <button
        onClick={() => setEmotion("neutral")}
        className="bg-gray-700 px-3 py-2 rounded hover:bg-gray-600"
      >
        Neutral
      </button>

    </div>
  );
}
