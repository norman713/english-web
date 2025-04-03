import { ChevronDown } from "lucide-react";
import logo from "../../assets/logo-removebg-preview (1).png";
import { useState } from "react";

interface NavbarProps {
  activeTab: string;
  userType: "user" | "admin" | "guest";
}

const Navbar = ({ activeTab, userType }: NavbarProps) => {
  const isLoggedIn = userType !== "guest";
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Helper function to determine the color of the link
  const getNavLinkColor = (tab: string) =>
    activeTab === tab ? "text-[#D09838] font-semibold" : "text-[#71869D]";

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Định nghĩa ảnh đại diện và tên cho user và admin
  const userInfo = {
    user: {
      avatar:
        "https://thuthuatnhanh.com/wp-content/uploads/2022/06/anh-cho-hai-lo-toc.jpg", // Thay bằng URL ảnh của user
      name: "Jennie",
    },
    admin: {
      avatar:
        "https://sieupet.com/sites/default/files/pictures/images/1-1473150685951-5.jpg", // Thay bằng URL ảnh của admin
      name: "Admin",
    },
  };

  return (
    <nav className="bg-white px-[20px] shadow-2xs border border-[#959595]">
      <div className="container flex justify-between items-center">
        <div>
          {/* Logo */}
          <img src={logo} alt="English 4 Us" className="w-[125px] h-[120px]" />
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-[50px]">
          {userType === "guest" && (
            <>
              <a href="/" className={`nav-link ${getNavLinkColor("home")}`}>
                Home
              </a>
              <a
                href="/vocab"
                className={`nav-link ${getNavLinkColor("vocab")}`}
              >
                Vocabulary
              </a>
              <a href="/test" className={`nav-link ${getNavLinkColor("test")}`}>
                Test
              </a>
              <a href="/login" className="nav-link text-[#71869D]">
                Login
              </a>
            </>
          )}

          {userType === "user" && (
            <>
              <a
                href="/vocab"
                className={`nav-link ${getNavLinkColor("vocab")}`}
              >
                Vocabulary
              </a>
              <a href="/test" className={`nav-link ${getNavLinkColor("test")}`}>
                Test
              </a>
              <a
                href="/admin/statistic"
                className={`nav-link ${getNavLinkColor("statistic")}`}
              >
                Statistic
              </a>
            </>
          )}

          {userType === "admin" && (
            <>
              <a
                href="/admin/statistic"
                className={`nav-link ${getNavLinkColor("statistic")}`}
              >
                Statistic
              </a>
              <a
                href="/vocab"
                className={`nav-link ${getNavLinkColor("vocab")}`}
              >
                Vocabulary
              </a>
              <a href="/test" className={`nav-link ${getNavLinkColor("test")}`}>
                Test
              </a>
            </>
          )}
        </div>

        {/* Hiển thị Login nếu chưa đăng nhập, hoặc hiển thị user/admin nếu đã đăng nhập */}
        <div className="flex items-center">
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
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-[#71869D] hover:bg-gray-100"
                    >
                      Profile
                    </a>
                    <a
                      href="/logout"
                      className="block px-4 py-2 text-sm text-[#71869D] hover:bg-gray-100"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <a href="/login" className="nav-link text-[#71869D]">
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
