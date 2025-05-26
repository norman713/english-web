import { Outlet } from "react-router-dom";
import Navbar from "../../components/NavBar/NavBar";
const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={"vocab"} userType={"admin"} />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
