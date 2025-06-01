import { ChevronDown } from "lucide-react";
import logo from "../../assets/logo-removebg-preview (1).png";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  activeTab: string;
  userType: "user" | "admin" | "guest";
}

const Navbar = ({ activeTab, userType }: NavbarProps) => {
  const location = useLocation();
  const isLoggedIn = userType !== "guest";
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Helper function to determine the color of the link
  const getNavLinkColor = (tab: string) =>
    location.pathname.includes(tab)
      ? "text-[#D09838] font-semibold"
      : "text-[#71869D]";

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Định nghĩa ảnh đại diện và tên cho user và admin
  const userInfo = {
    user: {
      avatar:
        "https://thuthuatnhanh.com/wp-content/uploads/2022/06/anh-cho-hai-lo-toc.jpg",
      name: "Jennie",
    },
    admin: {
      avatar:
        "https://sieupet.com/sites/default/files/pictures/images/1-1473150685951-5.jpg",
      name: "Admin",
    },
  };

  return (
    <nav className="bg-white px-[20px] shadow-xl border-0 border-[#959595]">
      <div className="container flex justify-between items-center">
        <div>
          {/* Logo */}
          <img src={logo} alt="English 4 Us" className="w-[125px] h-[120px]" />
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-[50px]">
          {userType === "guest" && (
            <>
              <Link to="/" className={`nav-link ${getNavLinkColor("home")}`}>
                Home
              </Link>
              <Link
                to="/vocab"
                className={`nav-link ${getNavLinkColor("vocab")}`}
              >
                Vocabulary
              </Link>
              <Link
                to="/test"
                className={`nav-link ${getNavLinkColor("test")}`}
              >
                Test
              </Link>
              <Link to="/login" className="nav-link text-[#71869D]">
                Login
              </Link>
            </>
          )}

          {userType === "user" && (
            <>
              <Link
                to="/user"
                className={`nav-link ${getNavLinkColor("vocab")}`}
              >
                Vocabulary
              </Link>
              <Link
                to="/user/test"
                className={`nav-link ${getNavLinkColor("test")}`}
              >
                Test
              </Link>
              <Link
                to="/user/statistic"
                className={`nav-link ${getNavLinkColor("statistic")}`}
              >
                Statistic
              </Link>
            </>
          )}

          {userType === "admin" && (
            <>
              <Link
                to="/admin"
                className={`nav-link ${getNavLinkColor("vocab")}`}
              >
                Vocabulary
              </Link>
              <Link
                to="/admin/test"
                className={`nav-link ${getNavLinkColor("test")}`}
              >
                Test
              </Link>
              <Link
                to="/admin/statistic"
                className={`nav-link ${getNavLinkColor("statistic")}`}
              >
                Statistic
              </Link>
              <Link
                to="/admin/user"
                className={`nav-link ${getNavLinkColor("user")}`}
              >
                User
              </Link>
            </>
          )}
        </div>

        {/* Hiển thị Login nếu chưa đăng nhập, hoặc hiển thị user/admin nếu đã đăng nhập */}
        <div className="flex px- [40px]">
          {isLoggedIn ? (
            <div className="relative flex items-center space-x-5">
              <img
                src={
                  userType === "admin"
                    ? userInfo.admin.avatar
                    : userInfo.user.avatar
                }
                alt="User Avatar"
                className="w-[70px] h-[70px] rounded-full"
              />
              <span className="text-[#71869D] nav-link">
                {userType === "admin"
                  ? userInfo.admin.name
                  : userInfo.user.name}
              </span>
              <div>
                <button onClick={toggleDropdown} className="text-[#71869D]">
                  <ChevronDown size={30} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-7 w-[150px] bg-white border border-[#959595] shadow-lg nav-link rounded-sm">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-[#71869D] hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-sm text-[#71869D] hover:bg-gray-100"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-link text-[#71869D]">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
