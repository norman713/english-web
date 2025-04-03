import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Sử dụng Routes thay vì Switch
import Navbar from "../../components/NavBar/NavBar";

// Các trang nội dung
import Home from "../Home";
import VocabularyPage from "./Vocab";

const User = () => {
  //   const [activeTab, setActiveTab] = useState("home"); // Trạng thái của tab đang được chọn
  //   const userType: "user" | "admin" | "guest" = "user"; // Ví dụ user đang đăng nhập

  return (
    <Router>
      <Navbar activeTab={"home"} userType={"user"} />
      <div className="container mt-6">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Dùng element */}
          <Route path="/vocab" element={<VocabularyPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default User;
