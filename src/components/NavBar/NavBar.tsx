// src/components/NavBar/NavBar.tsx

import { ChevronDown } from "lucide-react";
import logo from "../../assets/logo-removebg-preview (1).png";
import defaultAvatar from "../../assets/user.png"; // Ảnh mặc định khi không có avatar
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/**
 * Kiểu đại diện cho các vai trò thực tế trong JWT payload.
 * Nếu không đọc được token, mặc định là 'GUEST'.
 */
type RawRole = "ADMIN" | "SYSTEM_ADMIN" | "LEARNER" | "GUEST";

/**
 * Hàm helper: giải mã payload của JWT (base64URL → JSON),
 * trả về Record<string, unknown> thay vì any.
 */
function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const padded =
      base64Url +
      "===".slice((base64Url.length + 3) % 4); // thêm padding nếu cần
    const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload) as Record<string, unknown>;
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

const NavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Thông tin người dùng lấy từ token
  const [userName, setUserName] = useState<string>(""); // mặc định để trống
  const [userAvatar, setUserAvatar] = useState<string>(defaultAvatar);
  const [role, setRole] = useState<RawRole>("GUEST");

  // Khi mount, lấy accessToken và giải mã ra giá trị cần thiết
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        // Lấy role
        const roleField = decoded["role"];
        if (roleField === "ADMIN" || roleField === "SYSTEM_ADMIN") {
          setRole("ADMIN");
        } else if (roleField === "LEARNER") {
          setRole("LEARNER");
        } else {
          setRole("GUEST");
        }

        // Lấy name nếu có
        const nameField = decoded["name"];
        if (typeof nameField === "string" && nameField.trim() !== "") {
          setUserName(nameField);
        }

        // Lấy avatarUrl nếu có
        const avatarField = decoded["avatarUrl"];
        if (typeof avatarField === "string" && avatarField.trim() !== "") {
          setUserAvatar(avatarField);
        }
      }
    }
  }, []);

  // Xác định màu cho nav-link khi active
  const getNavLinkColor = (tab: string) =>
    location.pathname.includes(tab) ? "text-[#D09838] font-semibold" : "text-[#71869D]";

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const isLoggedIn = role !== "GUEST";

  // Nhấp logo ⇒ về "/home"
  const handleGoHome = () => {
    navigate("/home");
  };

  // Logout: xóa token và về trang login "/"
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  return (
    <nav className="bg-white px-[20px] shadow-xl border-0 border-[#959595]">
      <div className="container flex justify-between items-center py-2">
        {/* Logo */}
        <div onClick={handleGoHome} className="cursor-pointer">
          <img src={logo} alt="English 4 Us" className="w-[125px] h-[120px]" />
        </div>

        {/* Links chính */}
        <div className="flex space-x-[50px]">
          {role === "GUEST" && (
            <>
              <Link to="/home" className={`nav-link ${getNavLinkColor("home")}`}>
                Home
              </Link>
              <Link to="/vocab" className={`nav-link ${getNavLinkColor("vocab")}`}>
                Vocabulary
              </Link>
              <Link to="/test" className={`nav-link ${getNavLinkColor("test")}`}>
                Test
              </Link>
              <Link to="/" className="nav-link text-[#71869D]">
                Login
              </Link>
            </>
          )}

          {role === "LEARNER" && (
            <>
              <Link to="/user" className={`nav-link ${getNavLinkColor("vocab")}`}>
                Vocabulary
              </Link>
              <Link to="/user/test" className={`nav-link ${getNavLinkColor("test")}`}>
                Test
              </Link>
           
            </>
          )}

          {(role === "ADMIN" || role === "SYSTEM_ADMIN") && (
            <>
              <Link to="/admin" className={`nav-link ${getNavLinkColor("vocab")}`}>
                Vocabulary
              </Link>
              <Link to="/admin/test" className={`nav-link ${getNavLinkColor("test")}`}>
                Test
              </Link>
              <Link to="/admin/user" className={`nav-link ${getNavLinkColor("user")}`}>
                User
              </Link>
   
            </>
          )}
        </div>

        {/* Avatar / Tên / Dropdown */}
        <div className="flex items-center">
          {isLoggedIn ? (
            <div className="relative flex items-center space-x-4">
              {/* Avatar */}
              <img
                src={userAvatar}
                alt="User Avatar"
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
              {/* Tên */}
              <span className="text-[#71869D] nav-link">{userName || (role === "ADMIN" ? "Admin" : "User")}</span>

              {/* Nút dropdown */}
              <button onClick={toggleDropdown} className="text-[#71869D]">
                <ChevronDown size={24} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-8 w-[150px] bg-white border border-[#959595] shadow-lg nav-link rounded-sm z-10">
                  {role === "LEARNER" ? (
                    <Link
                      to="/user/statistic"
                      className="block px-4 py-2 text-sm text-[#71869D] hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                  ) : (
                    <Link
                      to="/admin/statistic"
                      className="block px-4 py-2 text-sm text-[#71869D] hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Statistic
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-[#71869D] hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/" className="nav-link text-[#71869D]">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
