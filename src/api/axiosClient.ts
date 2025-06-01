// src/api/axiosClient.ts
import axios from "axios";

// 1. Tạo một instance Axios với baseURL và header mặc định
const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Thêm request interceptor để đưa accessToken vào header
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy accessToken từ localStorage (nếu có)
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. (Tùy chọn) Thêm response interceptor để xử lý chung khi backend trả về lỗi 401/403
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu backend trả về unauthorized hoặc forbidden, bạn có thể logout hoặc redirect
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Ví dụ: xóa token, chuyển về trang login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // window.location.href = "/login"; // hoặc: useNavigate("/login") nếu trong React component
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
