import { Outlet } from "react-router-dom";
import Navbar from "../../components/NavBar/NavBar";
const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar is placed here once and will be present for all child routes */}
      <Navbar activeTab={"vocab"} userType={"admin"} />
      {/* Đây là chỗ render các trang con */}
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
