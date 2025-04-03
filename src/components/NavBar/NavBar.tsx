import logo from "../../assets/logo-removebg-preview (1).png";

interface NavbarProps {
  activeTab: string;
  userType: "user" | "admin" | "guest";
}

const Navbar = ({ activeTab, userType }: NavbarProps) => {
  const isLoggedIn = userType !== "guest";

  // Helper function to determine the color of the link
  const getNavLinkColor = (tab: string) =>
    activeTab === tab ? "text-[#D09838] font-semibold" : "text-[#71869D]";

  return (
    <nav className="bg-white px-[20px] shadow-2xl border border-[#959595]">
      <div className="container flex justify-between items-center">
        <div>
          {/* Logo */}
          <img src={logo} alt="English 4 Us" className="w-[125px] h-[120px]" />
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-[50px]">
          <a href="/" className={`nav-link ${getNavLinkColor("home")}`}>
            Home
          </a>
          <a href="/vocab" className={`nav-link ${getNavLinkColor("vocab")}`}>
            Vocabulary
          </a>
          <a href="/test" className={`nav-link ${getNavLinkColor("test")}`}>
            Test
          </a>
          {userType === "admin" && (
            <a
              href="/admin/statistic"
              className={`nav-link ${getNavLinkColor("statistic")}`}
            >
              Statistic
            </a>
          )}
        </div>

        {/* Hiển thị Login nếu chưa đăng nhập, hoặc hiển thị user/admin nếu đã đăng nhập */}
        <div className="flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <img
                src="path-to-avatar.jpg"
                alt="User Avatar"
                className="w-[30px] h-[30px] rounded-full"
              />
              <span className="text-[#71869D]">
                {userType === "admin" ? "Admin" : "Jennie"}
              </span>
              <div className="relative">
                <select className="appearance-none border-none bg-transparent text-[#71869D]">
                  <option>Profile</option>
                  <option>Logout</option>
                </select>
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
