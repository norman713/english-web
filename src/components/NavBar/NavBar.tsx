import logo from "../../assets/logo-removebg-preview (1).png";

const Navbar = () => {
  return (
    <nav className="bg-white px-[20px] shadow-2xl border border-[#959595]">
      <div className="container flex justify-between items-center">
        <div>
          {/* Logo */}
          <img src={logo} alt="English 4 Us" className="w-[138px] h-[134px]" />
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-[50px]">
          <a href="/" className="nav-link" style={{ color: "#D09838" }}>
            Home
          </a>
          <a href="/vocabulary" className="nav-link">
            Vocabulary
          </a>
          <a href="/test" className="nav-link">
            Test
          </a>
        </div>
        <div>
          <a href="/login" className="nav-link">
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
