// src/pages/Admin/AdminStatisticPage.tsx

import React, { useState, useEffect, useRef } from "react";
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
import userApi, {
  UserInfo,
  UploadAvatarResponse,
  AdminStatistic,
  AdminStatisticsResponse,
  LearnerStatisticsResponse,
} from "../../../api/userApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

const AdminStatisticPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Profile state
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [name, setName] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);

  // Admin statistics state
  const [admins, setAdmins] = useState<AdminStatistic[]>([]);
  const [totalAdmins, setTotalAdmins] = useState<number>(0);
  const [totalTestsPublished, setTotalTestsPublished] = useState<number>(0);
  const [totalSetsPublished, setTotalSetsPublished] = useState<number>(0);

  // “Total lượt làm đề” comes from learner‐statistics API
  const [totalAttempts, setTotalAttempts] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder chart data (unchanged)
  const [chartData, setChartData] = useState({
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
  });
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
          callback: (tickValue: number | string) => `${tickValue}%`,
        },
      },
    },
  };

  // Fetch current user (admin)
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const info = await userApi.getCurrentUser();
        setUserInfo(info);
        setName(info.name);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      }
    }
    fetchCurrentUser();
  }, []);

  // Fetch both admin‐statistics AND learner‐statistics
  useEffect(() => {
    const fetchAllStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) GET /api/statistic/admin?page=1&size=10
        const adminResp: AdminStatisticsResponse = await userApi.getAdminStatistics(1, 10);
        setAdmins(adminResp.admins);
        setTotalAdmins(adminResp.totalItems);

        // Sum up testsPublished and setsPublished
        const sumTestsPub = adminResp.admins.reduce(
          (acc, a) => acc + a.totalTestsPublished,
          0
        );
        const sumSetsPub = adminResp.admins.reduce(
          (acc, a) => acc + a.totalSetsPublished,
          0
        );
        setTotalTestsPublished(sumTestsPub);
        setTotalSetsPublished(sumSetsPub);

        // 2) GET /api/statistic/learner?page=1&size=100 to calculate “total lượt làm đề”
        const learnerResp: LearnerStatisticsResponse = await userApi.getLearnerStatistics(1, 100);
        const sumAttempts = learnerResp.learners.reduce(
          (acc, l) => acc + l.totalTestsTaken,
          0
        );
        setTotalAttempts(sumAttempts);
      } catch (err) {
        console.error("Lỗi khi lấy thống kê:", err);
        setError("Không thể tải dữ liệu thống kê.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  // Save edited name (PATCH /api/users)
  const handleSaveName = async () => {
    if (!userInfo) return;
    try {
      const resp = await userApi.updateProfile({ name });
      setUserInfo((prev) =>
        prev
          ? {
              ...prev,
              name: resp.name,
            }
          : prev
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật tên:", err);
      alert("Không thể cập nhật tên.");
      setName(userInfo.name);
    }
    setEditing(false);
  };

  // Upload avatar (POST /api/users/avatar)
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    try {
      const resp: UploadAvatarResponse = await userApi.uploadAvatar(file);
      if (resp.success) {
        setUserInfo((prev) =>
          prev
            ? {
                ...prev,
                avatarUrl: resp.message,
              }
            : prev
        );
      } else {
        console.error("Upload avatar không thành công:", resp);
        alert("Không thể cập nhật avatar.");
      }
    } catch (err) {
      console.error("Lỗi khi upload avatar:", err);
      alert("Không thể upload avatar.");
    }
  };

  return (
    <div>
      {/* Profile */}
      <div
        className="p-4 flex flex-col items-center rounded-md w-full mx-auto"
        style={{
          background: "linear-gradient(90deg, #FFD0D0 0%, #F99DE5 100%)",
        }}
      >
        {/* Avatar */}
        <div className="relative">
          <img
            src={
              userInfo?.avatarUrl ||
              "https://via.placeholder.com/64x64.png?text=Avatar"
            }
            alt="User Avatar"
            className="w-26 h-26 rounded-full object-cover mb-2 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Editable Name */}
        <div className="flex items-center space-x-1">
          {editing ? (
            <input
              type="text"
              className="text-gray-600 font-semibold rounded border border-gray-300 px-1 py-0.5"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveName();
                }
              }}
            />
          ) : (
            <>
              <span className="text-gray-600 font-semibold">
                {userInfo?.name || ""}
              </span>
              <button onClick={() => setEditing(true)} aria-label="Edit name">
                <PencilIcon className="w-4 h-4 text-pink-500 cursor-pointer" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-6 px-[50px]">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">
          Thống kê quản trị viên
        </h1>

        {/* Loading / Error */}
        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {/* Tổng quan */}
            <div className="grid grid-cols-3 gap-4 mb-6 px-[100px]">
              <div className="text-center bg-green-100 rounded-lg py-6">
                <div className="text-3xl font-bold">{totalAdmins}</div>
                <div className="text-gray-600">Số quản trị viên</div>
              </div>

              {/* Now show totalAttempts instead of totalTestsPublished */}
              <div className="text-center bg-purple-100 rounded-lg py-6">
                <div className="text-3xl font-bold">{totalAttempts}</div>
                <div className="text-gray-600">tổng lượt làm đề</div>
              </div>

              <div className="text-center bg-blue-100 rounded-lg py-6">
                <div className="text-3xl font-bold">{totalSetsPublished}</div>
                <div className="text-gray-600">bộ từ đã thêm</div>
              </div>
            </div>

            {/* Biểu đồ (placeholder) */}
            <div className="flex justify-center">
              <div className="w-[900px] h-[500px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminStatisticPage;
