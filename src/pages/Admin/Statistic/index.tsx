import React, { useState } from "react";
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

  return (
    <div className="p-6 px-[50px]">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Thống kê kết quả
      </h1>

      {/* Bộ lọc thời gian */}

      <div className="flex justify-center items-center gap-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="7days">7 ngày gần nhất</option>
          <option value="30days">30 ngày</option>
          <option value="60days">60 ngày</option>
          <option value="1year">1 năm</option>
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
          <div className="text-3xl font-bold">180 phút</div>
          <div className="text-gray-600">lượt làm đề</div>
        </div>
        <div className="text-center bg-blue-100 rounded-lg py-6">
          <div className="text-3xl font-bold">75%</div>
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
  );
};

export default AdminStatisticPage;
