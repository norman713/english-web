import { Outlet } from "react-router-dom";
import Navbar from "../../components/NavBar/NavBar";

const User = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar is placed here once and will be present for all child routes */}
      <Navbar activeTab={"vocab"} userType={"user"} />
      <div>
        {/* Outlet renders the child route components */}
        <Outlet />
      </div>
    </div>
  );
};

export default User;
