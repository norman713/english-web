import { Outlet } from "react-router-dom";
import Navbar from "../../components/NavBar/NavBar";
const User = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={"vocab"} userType={"user"} />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default User;
