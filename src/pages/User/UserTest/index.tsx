import { Outlet } from "react-router-dom";
import Navbar from "../../../components/NavBar/NavBar";
const UserTest = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={"test"} userType={"user"} />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default UserTest;
