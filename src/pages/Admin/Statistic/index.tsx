import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { PencilIcon } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

const AdminStatisticPage = () => {
  const [selectedRange, setSelectedRange] = useState("all");

  const chartData = {
    labels: ["2025-02-28"],
    datasets: [
      {
        label: "%Correct (Đúng)",
        data: [75],
        borderColor: "#ff5b5b",
        backgroundColor: "#ff5b5b",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: function (tickValue: number | string) {
            return `${tickValue}%`;
          },
        },
      },
    },
  };
  // edit name of profile
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Jennie");
  const saveName = () => {
    setEditing(false);
  };

  return (
    <div>
      {/* profile */}
      <div
        className="p-4 flex flex-col items-center rounded-md w-full mx-auto"
        style={{
          background: "linear-gradient(90deg, #FFD0D0 0%, #F99DE5 100%)",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=64&q=80"
          alt="User Avatar"
          className="w-26 h-26 rounded-full object-cover mb-2"
        />
        <div className="flex items-center space-x-1">
          {editing ? (
            <input
              type="text"
              className="text-gray-600 font-semibold rounded border border-gray-300 px-1 py-0.5"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveName();
                }
              }}
            />
          ) : (
            <>
              <span className="text-gray-600 font-semibold">{name}</span>
              <button onClick={() => setEditing(true)} aria-label="Edit name">
                <PencilIcon className="w-4 h-4 text-pink-500 cursor-pointer" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="p-6 px-[50px]">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">
          Thống kê kết quả
        </h1>

        {/* Bộ lọc thời gian */}

        <div className="flex justify-items-start items-center gap-4 mb-6">
          <select
            className="border rounded px-3 py-2"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
          <button className="bg-[#A3C8FF] text-black font-semibold px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors">
            Search
          </button>
          <button className="bg-[#E6F0FF] text-black font-semibold px-4 py-2 rounded hover:bg-blue-100 transition-colors">
            Clear
          </button>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-3 gap-4 mb-6 px-[100px]">
          <div className="text-center bg-green-100 rounded-lg py-6">
            <div className="text-3xl font-bold">1</div>
            <div className="text-gray-600">đề đã thêm</div>
          </div>
          <div className="text-center bg-purple-100 rounded-lg py-6">
            <div className="text-3xl font-bold">1800</div>
            <div className="text-gray-600">lượt làm đề</div>
          </div>
          <div className="text-center bg-blue-100 rounded-lg py-6">
            <div className="text-3xl font-bold">5</div>
            <div className="text-gray-600">bộ từ đã thêm</div>
          </div>
        </div>

        {/* Biểu đồ */}
        <div className="flex justify-center">
          <div className="w-[900px] h-[500px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatisticPage;
