export default function SuggestionCard({ emotion }) {
  let message = "";
  let color = "";

  if (emotion === "happy") {
    message = "You're in a great mood! Keep enjoying ";
    color = "bg-green-600";
  } else if (emotion === "sad") {
    message = "You seem down. Try relaxing music ";
    color = "bg-blue-600";
  } else if (emotion === "angry") {
    message = "Take a deep breath. Try calming tracks ";
    color = "bg-red-600";
  } else {
    message = "Stay balanced. Chill vibes recommended ";
    color = "bg-gray-600";
  }

  return (
    <div className={`${color} p-4 rounded-xl text-white`}>
      <p>{message}</p>
    </div>
  );
}