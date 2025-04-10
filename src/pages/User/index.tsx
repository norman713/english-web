import { Outlet } from "react-router-dom";
import Navbar from "../../components/NavBar/NavBar";
import StatusTab from "../../components/StatusTab";
import Tab from "../../components/Tab";

const User = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar is placed here once and will be present for all child routes */}
      <Navbar activeTab={"vocab"} userType={"user"} />

      {/* Trạng thái */}
      <div className="flex justify-center items-center space-x-[70px] py-[30px]">
        <StatusTab number={20} text="đã học" backgroundColor="bg-[#F3F7FF]" />
        <StatusTab number={5} text="đã nhớ" backgroundColor="bg-[#E6F7E6]" />
        <StatusTab
          number={5}
          text="chưa học"
          backgroundColor="bg-[#FFE6E6]"
          numberColor="text-[#FA1616]"
        />
      </div>

      {/* Tabs */}
      <div className="bg-[rgba(169,201,227,0.23)] px-[14px] py-[31px] flex flex-col gap-[29px]">
        <text className="banner-text text-[60px] font-semibold">Flashcard</text>

        <nav className="flex justify-between items-center">
          <div>
            <Tab
              labels={["List từ của tôi", "Đang học", "Khám phá"]}
              paths={["/user/vocab/my-list", "/user/vocab/learning", "/user/vocab/explore"]}
            />
          </div>
        </nav>
      </div>


      <div>
        {/* Outlet renders the child route components */}
        <Outlet />
      </div>
    </div>
  );
};

export default User;