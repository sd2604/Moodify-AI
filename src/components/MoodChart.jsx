import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function MoodChart({ moodHistory }) {
  const chartData = moodHistory.map((item) => ({
    time: item.time.split(" ")[0],
    value:
      item.emotion === "happy"
        ? 4
        : item.emotion === "neutral"
        ? 3
        : item.emotion === "sad"
        ? 2
        : 1,
  }));

  return (
    <div className="bg-gray-900 p-4 rounded-xl text-white">

      {chartData.length === 0 ? (
        <p>No data yet</p>
      ) : (
        <LineChart width={300} height={250} data={chartData}>
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#a855f7" />
        </LineChart>
      )}
    </div>
  );
}