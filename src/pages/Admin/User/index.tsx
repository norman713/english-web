// src/pages/Admin/User/index.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { isAxiosError } from "axios";
import Pagination from "../../../components/Pagination";
import userApi, {
  AdminStatistic,
  LearnerStatistic,
  CreateAdminRequest,
} from "../../../api/userApi";
import { parseJwt } from "../../../utils/jwtHelper"; // hàm parseJwt đã mô tả trước
import "react-toastify/dist/ReactToastify.css";

type RawRole = "ADMIN" | "SYSTEM_ADMIN" | "LEARNER" | "GUEST";

interface LearnerRow extends LearnerStatistic {
  joinedDisplay: string;
  avgScoreDisplay: string;
}
interface AdminRow extends AdminStatistic {
  joinedDisplay: string;
}

const itemsPerPage = 5;

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();

  // ============================================================
  // 1. State để lưu role và trạng thái đang kiểm tra (checkingAuth)
  // ============================================================
  const [role, setRole] = useState<RawRole>("GUEST");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ===============================================
  // 2. State cho Learner list + phân trang + loading
  // ===============================================
  const [learnerUsers, setLearnerUsers] = useState<LearnerRow[]>([]);
  const [currentPageLearner, setCurrentPageLearner] = useState(1);
  const [totalItemsLearner, setTotalItemsLearner] = useState(0);
  const [loadingLearners, setLoadingLearners] = useState(false);

  // ===============================================
  // 3. State cho Admin list + phân trang + loading
  // ===============================================
  const [adminUsers, setAdminUsers] = useState<AdminRow[]>([]);
  const [currentPageAdmin, setCurrentPageAdmin] = useState(1);
  const [totalItemsAdmin, setTotalItemsAdmin] = useState(0);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  // ======================
  // 4. State cho tab active
  // ======================
  const [activeTab, setActiveTab] = useState<"learner" | "admin">("learner");

  // =====================================================
  // 5. State cho modal "Create New Admin" (chỉ SYSTEM_ADMIN)
  // =====================================================
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState<{
    name: string;
    email: string;
    password: string;
  }>({ name: "", email: "", password: "" });

  // =====================================================
  // useEffect #1: Khi component mount, decode JWT để lấy role
  // =====================================================
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Bạn chưa đăng nhập hoặc token không hợp lệ.");
      navigate("/", { replace: true });
      setCheckingAuth(false);
      return;
    }

    const decoded = parseJwt(token);
    if (!decoded) {
      toast.error("Token không hợp lệ.");
      navigate("/", { replace: true });
      setCheckingAuth(false);
      return;
    }

    const roleField = decoded["role"];
    if (roleField === "SYSTEM_ADMIN") {
      setRole("SYSTEM_ADMIN");
    } else if (roleField === "ADMIN") {
      setRole("ADMIN");
    } else if (roleField === "LEARNER") {
      setRole("LEARNER");
    } else {
      setRole("GUEST");
    }

    if (
      roleField !== "SYSTEM_ADMIN" &&
      roleField !== "ADMIN" &&
      roleField !== "LEARNER"
    ) {
      toast.error("Bạn không có quyền truy cập.");
      navigate("/unauthorized", { replace: true });
    }

    setCheckingAuth(false);
  }, [navigate]);

  // ======================================================================================
  // Hàm fetchLearners (chủ động gọi khi cần reload dữ liệu)
  // ======================================================================================
  const fetchLearners = async (page: number) => {
    if (role !== "SYSTEM_ADMIN" && role !== "ADMIN") return;
    setLoadingLearners(true);
    try {
      const data = await userApi.getLearnerStatistics(page, itemsPerPage);
      const mapped: LearnerRow[] = data.learners.map((u) => ({
        ...u,
        joinedDisplay: new Date(u.joinAt).toLocaleDateString("en-GB"),
        avgScoreDisplay: `${u.avgScore * 100}%`,
      }));
      setLearnerUsers(mapped);
      setTotalItemsLearner(data.totalItems);
    } catch (err: unknown) {
      console.error("Lỗi khi lấy learner statistics:", err);
      if (isAxiosError(err) && err.response) {
        const msg = (err.response.data as { message?: string }).message;
        toast.error(`Lỗi server: ${msg ?? err.response.status}`);
      } else {
        toast.error("Không thể kết nối tới server để lấy learners");
      }
    } finally {
      setLoadingLearners(false);
    }
  };

  // ======================================================================================
  // Hàm fetchAdmins (chủ động gọi khi cần reload dữ liệu)
  // ======================================================================================
  const fetchAdmins = async (page: number) => {
    if (role !== "SYSTEM_ADMIN") return;
    setLoadingAdmins(true);
    try {
      const data = await userApi.getAdminStatistics(page, itemsPerPage);
      const mapped: AdminRow[] = data.admins.map((u) => ({
        ...u,
        joinedDisplay: new Date(u.joinAt).toLocaleDateString("en-GB"),
      }));
      setAdminUsers(mapped);
      setTotalItemsAdmin(data.totalItems);
    } catch (err: unknown) {
      console.error("Lỗi khi lấy admin statistics:", err);
      if (isAxiosError(err) && err.response) {
        const msg = (err.response.data as { message?: string }).message;
        toast.error(`Lỗi server: ${msg ?? err.response.status}`);
      } else {
        toast.error("Không thể kết nối tới server để lấy admins");
      }
    } finally {
      setLoadingAdmins(false);
    }
  };

  // ======================================================================================
  // useEffect #2: Fetch Learner khi currentPageLearner hoặc role thay đổi
  // ======================================================================================
  useEffect(() => {
    fetchLearners(currentPageLearner);
  }, [currentPageLearner, role]);

  // ===================================================================================
  // useEffect #3: Fetch Admin khi currentPageAdmin hoặc role thay đổi
  // ===================================================================================
  useEffect(() => {
    fetchAdmins(currentPageAdmin);
  }, [currentPageAdmin, role]);

  // ======================================================================================
  // Nếu đang xác thực role (checkingAuth = true), hiển thị loading
  // ======================================================================================
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-64">
        <span>Loading...</span>
      </div>
    );
  }
  if (role === "GUEST") {
    return null;
  }

  // ====================================================================================
  // Hàm Lock/Unlock user (chỉ SYSTEM_ADMIN mới thao tác), gọi thẳng fetch lại sau khi thành công
  // ====================================================================================
  const handleToggleStatus = async (
    userType: "learner" | "admin",
    userId: string,
    currentlyLocked: boolean
  ) => {
    if (role !== "SYSTEM_ADMIN") {
      toast.error("Chỉ System Admin mới có quyền thao tác.");
      return;
    }

    const action = currentlyLocked ? "unlock" : "lock";
    const confirmed = window.confirm(`Bạn có chắc muốn ${action} user này?`);
    if (!confirmed) return;

    try {
      await userApi.lockOrUnlockUser(userId, !currentlyLocked);
      toast.success(
        action === "lock"
          ? "Khóa user thành công."
          : "Mở khóa user thành công."
      );

      // Sau khi thành công, fetch lại trang tương ứng
      if (userType === "learner") {
        await fetchLearners(currentPageLearner);
      } else {
        await fetchAdmins(currentPageAdmin);
      }
    } catch (err: unknown) {
      console.error("Lỗi khi đổi trạng thái user:", err);
      if (isAxiosError(err) && err.response) {
        const msg = (err.response.data as { message?: string }).message;
        toast.error(`Lỗi server: ${msg ?? err.response.status}`);
      } else {
        toast.error("Operation failed.");
      }
    }
  };

  // ====================================================================================
  // Hàm Create Admin mới (chỉ SYSTEM_ADMIN mới thao tác), fetch lại sau khi thành công
  // ====================================================================================
  const handleCreateAdmin = async () => {
    if (role !== "SYSTEM_ADMIN") {
      toast.error("Chỉ System Admin mới có quyền tạo Admin.");
      return;
    }

    const { name, email, password } = newAdminForm;
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Vui lòng điền đầy đủ Name, Email, Password");
      return;
    }

    try {
      const payload: CreateAdminRequest = { name, email, password };
      const resp = await userApi.createAdminAccount(payload);
      if (resp.success) {
        toast.success("Tạo admin thành công!");
        setShowCreateModal(false);
        setNewAdminForm({ name: "", email: "", password: "" });
        // Fetch lại trang Admin sau khi tạo
        await fetchAdmins(currentPageAdmin);
      } else {
        toast.error(resp.message || "Tạo admin thất bại.");
      }
    } catch (err: unknown) {
      console.error("Lỗi khi tạo admin:", err);
      if (isAxiosError(err) && err.response) {
        const msg = (err.response.data as { message?: string }).message;
        toast.error(`Lỗi server: ${msg ?? err.response.status}`);
      } else {
        toast.error("Lỗi không xác định.");
      }
    }
  };

  return (
    <div className="p-6 font-sans space-y-6">
      {/* 1. Thêm ToastContainer để render toast lên màn hình */}
      <ToastContainer />

      {/* Tab bar */}
      <div className="flex space-x-4 pb-2">
        <button
          onClick={() => setActiveTab("learner")}
          className={`text-[20px] font-semibold px-4 py-2 rounded-t ${
            activeTab === "learner"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Learner
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`text-[20px] font-semibold px-4 py-2 rounded-t ${
            activeTab === "admin"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Admin
        </button>
      </div>

      {/* ========================= Learner Table ========================= */}
      {activeTab === "learner" && (
        <div>


          {/* Tiêu đề cột */}
          <div className="grid grid-cols-7 font-semibold text-sm text-gray-500 py-2 border-b">
            <div>Name</div>
            <div>Email</div>
            <div>Joined</div>
            <div>Tests Taken</div>
            <div>Avg Score</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {/* Dữ liệu Learner */}
          {loadingLearners
            ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-7 py-3 text-sm border-b items-center animate-pulse bg-gray-100 h-10"
                >
                  {Array.from({ length: 7 }).map((__, i) => (
                    <div key={i}></div>
                  ))}
                </div>
              ))
            : learnerUsers.map((user) => (
                <div
                  key={user.userId}
                  className="grid grid-cols-7 py-3 text-sm border-b items-center"
                >
                  <div>{user.name}</div>
                  <div>{user.email}</div>
                  <div>{user.joinedDisplay}</div>
                  <div>{user.totalTestsTaken}</div>
                  <div>{user.avgScoreDisplay}</div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        !user.locked ? "bg-teal-400" : "bg-red-300"
                      } text-white`}
                    >
                      {!user.locked ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div>
                    {role === "SYSTEM_ADMIN" ? (
                      <button
                        onClick={() =>
                          handleToggleStatus(
                            "learner",
                            user.userId,
                            user.locked
                          )
                        }
                        className="px-3 py-1 rounded text-sm font-semibold w-[80px] text-white bg-blue-600 hover:bg-blue-700 transition"
                      >
                        {user.locked ? "Unlock" : "Lock"}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">–</span>
                    )}
                  </div>
                </div>
              ))}

          <Pagination
            totalItems={totalItemsLearner}
            itemsPerPage={itemsPerPage}
            currentPage={currentPageLearner}
            onPageChange={setCurrentPageLearner}
          />
        </div>
      )}

      {/* ========================= Admin Table ========================= */}
      {activeTab === "admin" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            {role === "SYSTEM_ADMIN" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-500 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-600 transition"
              >
                + Create Admin
              </button>
            )}
          </div>

          {/* Tiêu đề cột */}
          <div className="grid grid-cols-7 font-semibold text-sm text-gray-500 py-2 border-b">
            <div>Name</div>
            <div>Email</div>
            <div>Joined</div>
            <div>Tests Published</div>
            <div>Sets Published</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {/* Dữ liệu Admin */}
          {loadingAdmins
            ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-7 py-3 text-sm border-b items-center animate-pulse bg-gray-100 h-10"
                >
                  {Array.from({ length: 7 }).map((__, i) => (
                    <div key={i}></div>
                  ))}
                </div>
              ))
            : adminUsers.map((user) => (
                <div
                  key={user.userId}
                  className="grid grid-cols-7 py-3 text-sm border-b items-center"
                >
                  <div>{user.name}</div>
                  <div>{user.email}</div>
                  <div>{user.joinedDisplay}</div>
                  <div>{user.totalTestsPublished}</div>
                  <div>{user.totalSetsPublished}</div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        !user.locked ? "bg-teal-400" : "bg-red-300"
                      } text-white`}
                    >
                      {!user.locked ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div>
                    {role === "SYSTEM_ADMIN" ? (
                      <button
                        onClick={() =>
                          handleToggleStatus("admin", user.userId, user.locked)
                        }
                        className="px-3 py-1 rounded text-sm font-semibold w-[80px] text-white bg-blue-600 hover:bg-blue-700 transition"
                      >
                        {user.locked ? "Unlock" : "Lock"}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">–</span>
                    )}
                  </div>
                </div>
              ))}

          <Pagination
            totalItems={totalItemsAdmin}
            itemsPerPage={itemsPerPage}
            currentPage={currentPageAdmin}
            onPageChange={setCurrentPageAdmin}
          />
        </div>
      )}

      {/* ========================= Modal Create Admin ========================= */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">Create New Admin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={newAdminForm.name}
                  onChange={(e) =>
                    setNewAdminForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border p-2 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={newAdminForm.email}
                  onChange={(e) =>
                    setNewAdminForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full border p-2 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={newAdminForm.password}
                  onChange={(e) =>
                    setNewAdminForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full border p-2 rounded text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAdmin}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
