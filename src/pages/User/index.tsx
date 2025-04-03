import { Outlet } from "react-router-dom";
import Navbar from "../../components/NavBar/NavBar";

const User = () => {
  return (
    <div className="min-h-screen flex flex-col text-gray-900">
      {/* Navbar is placed here once and will be present for all child routes */}
      <Navbar activeTab={"home"} userType={"user"} />

      <div className="container mt-6 flex-grow">
        {/* Outlet renders the child route components */}
        <Outlet />
      </div>
    </div>
  );
};

export default User;
