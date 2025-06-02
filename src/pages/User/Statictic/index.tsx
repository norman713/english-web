// src/pages/User/Statistic/index.tsx

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
import { useNavigate } from "react-router-dom";
import {
  getPaginatedResults,
  PaginatedResultsDTO,
} from "../../../api/resultApi";
import {
  getResultStatistics,
  ResultStatisticDTO,
} from "../../../api/statisticApi";
import userApi, { UserInfo, UploadAvatarResponse } from "../../../api/userApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

interface GroupedHistory {
  title: string;
  attempts: {
    id: string;
    date: string;
    score: string;
    time: string;
  }[];
}

const StatisticPage: React.FC = () => {
  const navigate = useNavigate();

  // 1) Selected range: chỉ cho phép "week" | "month" | "year"
  const [selectedRange, setSelectedRange] = useState<"week" | "month" | "year">("week");

  // 2) Lưu lịch sử làm đề đã fetch
  const [groupedHistory, setGroupedHistory] = useState<GroupedHistory[]>([]);
  const [resultsPage, setResultsPage] = useState<number>(1);
  const [totalResultPages, setTotalResultPages] = useState<number>(1);

  // 3) Lưu dữ liệu thống kê (mảng {time, resultCount, avgSecondsSpent, avgAccuracy})
  const [statData, setStatData] = useState<ResultStatisticDTO[]>([]);

  // 4) Profile hiện tại
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [name, setName] = useState<string>("");       // để edit tên
  const [editing, setEditing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 5) Dữ liệu cho chart
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: "%Correct (Đúng)",
        data: [],
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

  // --------------------
  // A) Khi mount, fetch thông tin người dùng rồi gán vào state
  // --------------------
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const info = await userApi.getCurrentUser();
        setUserInfo(info);
        setName(info.name);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin hiện tại:", err);
      }
    }

    fetchCurrentUser();
  }, []);

  // --------------------
  // B) Khi selectedRange thay đổi, gọi API thống kê
  // --------------------
  useEffect(() => {
    async function fetchStatistics() {
      // Tính from/to dựa vào selectedRange
      const today = new Date();
      const fromDate = new Date();

      if (selectedRange === "week") {
        fromDate.setDate(today.getDate() - 7);
      } else if (selectedRange === "month") {
        fromDate.setMonth(today.getMonth() - 1);
      } else {
        fromDate.setFullYear(today.getFullYear() - 1);
      }

      const toStr = today.toISOString().split("T")[0];
      const fromStr = fromDate.toISOString().split("T")[0];
      const groupBy = selectedRange === "week"
        ? "WEEK"
        : selectedRange === "month"
        ? "MONTH"
        : "YEAR";

      try {
        const data = await getResultStatistics(fromStr, toStr, groupBy);
        setStatData(data);

        // Build dữ liệu chart: labels = data.time, data = avgAccuracy * 100
        const labels = data.map((d) => d.time);
        const accuracies = data.map((d) => Math.round(d.avgAccuracy * 100));

        setChartData({
          labels,
          datasets: [
            {
              label: "%Correct (Đúng)",
              data: accuracies,
              borderColor: "#ff5b5b",
              backgroundColor: "#ff5b5b",
              tension: 0.4,
            },
          ],
        });
      } catch (err) {
        console.error("Lỗi khi tải thống kê kết quả:", err);
      }
    }

    fetchStatistics();
  }, [selectedRange]);

  // --------------------
  // C) Khi trang kết quả (resultsPage) thay đổi, gọi API lịch sử làm đề
  // --------------------
  useEffect(() => {
    async function fetchHistory() {
      try {
        const data: PaginatedResultsDTO = await getPaginatedResults(resultsPage, 10);

        // Nhóm theo testName
        const groups: Record<string, { id: string; date: string; score: string; time: string }[]> = {};
        data.results.forEach((r) => {
          if (!groups[r.testName]) {
            groups[r.testName] = [];
          }
          groups[r.testName].push({
            id: r.id,
            date: new Date(r.submitTime).toLocaleDateString(),
            score: `${r.score}`,
            time: `${Math.ceil(r.secondsSpent / 60)} phút`,
          });
        });

        const groupedArray: GroupedHistory[] = Object.entries(groups).map(
          ([title, attempts]) => ({ title, attempts })
        );
        setGroupedHistory(groupedArray);
        setTotalResultPages(data.totalPages);
      } catch (err) {
        console.error("Lỗi khi tải lịch sử làm đề:", err);
      }
    }

    fetchHistory();
  }, [resultsPage]);

  // --------------------
  // D) Tính toán số liệu “Tổng quan”:
  //    - totalRuns   = tổng tất cả resultCount
  //    - totalMinutes = tổng avgSecondsSpent / 60
  //    - avgAccPercent = trung bình phần trăm của avgAccuracy
  // --------------------
  const totalRuns = statData.reduce((sum, d) => sum + d.resultCount, 0);
  const totalMinutes = Math.ceil(
    statData.reduce((sum, d) => sum + d.avgSecondsSpent, 0) / 60
  );
  const avgAccPercent =
    statData.length > 0
      ? Math.round(
          statData.reduce((sum, d) => sum + d.avgAccuracy * 100, 0) /
            statData.length
        )
      : 0;

  // --------------------
  // E) Xử lý lưu tên (updateProfile)
  // --------------------
  const handleSaveName = async () => {
    if (!userInfo) return;
    try {
      const resp = await userApi.updateProfile({ name });
      // Chỉ cần cập nhật lại state của userInfo
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
      // Nếu có cần, có thể rollback giá trị name cũ:
      setName(userInfo.name);
    }
    setEditing(false);
  };

  // --------------------
  // F) Xử lý upload avatar
  // --------------------
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    try {
      const resp: UploadAvatarResponse = await userApi.uploadAvatar(file);
      if (resp.success) {
        // Cập nhật ngay giao diện
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
        {/* Hiển thị avatar (nếu có), nếu không có thì show placeholder */}
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
          {/* Input type=file ẩn để chọn avatar */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Tên user có thể edit */}
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
              <button
                onClick={() => setEditing(true)}
                aria-label="Edit name"
              >
                <PencilIcon className="w-4 h-4 text-pink-500 cursor-pointer" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 px-[50px]">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">
          Thống kê kết quả
        </h1>

        {/* Bộ lọc thời gian */}
        <div className="flex justify-items-start items-center gap-4 mb-6">
          <select
            className="border rounded px-3 py-2"
            value={selectedRange}
            onChange={(e) =>
              setSelectedRange(e.target.value as "week" | "month" | "year")
            }
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
            <div className="text-3xl font-bold">{totalRuns}</div>
            <div className="text-gray-600">số lần làm đề</div>
          </div>
          <div className="text-center bg-purple-100 rounded-lg py-6">
            <div className="text-3xl font-bold">{totalMinutes} phút</div>
            <div className="text-gray-600">thời gian luyện</div>
          </div>
          <div className="text-center bg-blue-100 rounded-lg py-6">
            <div className="text-3xl font-bold">{avgAccPercent}%</div>
            <div className="text-gray-600">độ chính xác</div>
          </div>
        </div>

        {/* Biểu đồ */}
        <div className="flex justify-center">
          <div className="w-[900px] h-[500px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Danh sách đề đã làm */}
        <div>
          <h2 className="text-[#009DFF] font-semibold mb-4 text-[20px]">
            Danh sách các đề thi đã làm
          </h2>
          {groupedHistory.map((test, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-md mb-8 overflow-hidden"
              style={{ boxShadow: "0 0 0 1px #E1E9F1" }}
            >
              {/* Tiêu đề đề thi */}
              <div className="bg-white px-[30px] py-3 font-semibold text-[#009DFF] text-base">
                {test.title}
              </div>

              {/* Các dòng attempt */}
              {test.attempts.map((attempt, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-4 items-center gap-8 px-[30px] py-4 text-sm
                    ${idx % 2 === 0 ? "bg-[#F0F6FB]" : "bg-white"}
                    border-t border-[#E1E9F1]
                  `}
                >
                  <div>
                    <strong className="text-gray-500 font-bold">Ngày làm</strong>
                    <div className="text-[#999999]">{attempt.date}</div>
                  </div>
                  <div>
                    <strong className="text-gray-500 font-bold">Kết quả thi</strong>
                    <div className="text-[#999999]">{attempt.score}</div>
                  </div>
                  <div>
                    <strong className="text-gray-500 font-bold">
                      Thời gian làm bài
                    </strong>
                    <div className="text-[#999999]">{attempt.time}</div>
                  </div>
                  <div>
                    <button
                      className="text-[#009DFF] font-semibold cursor-pointer hover:text-[#005FCC] hover:underline focus:outline-none"
                      onClick={() => {
                        navigate(`/user/test-result/${attempt.id}`);
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Phân trang nếu có */}
          {totalResultPages > 1 && (
            <div className="flex justify-center gap-2 mb-8">
              {Array.from({ length: totalResultPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded ${
                      page === resultsPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setResultsPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticPage;
