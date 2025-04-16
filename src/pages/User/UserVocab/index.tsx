import { Outlet } from "react-router-dom";
import Tab from "../../../components/Tab";
const VocabLayout = () => {
  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="bg-[rgba(169,201,227,0.23)] px-[40px] py-[31px] flex flex-col gap-[29px]">
        <text className="banner-text text-[50px] font-semibold">Flashcard</text>

        <nav className="flex justify-between items-center">
          <div>
            <Tab
              labels={["List từ của tôi", "Đang học", "Khám phá"]}
              paths={[
                "/user/user-vocab/my-list",
                "/user/user-vocab/learning",
                "/user/user-vocab/explore",
              ]}
            />
          </div>
        </nav>
      </div>

      {/* Đây là chỗ render các trang con */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default VocabLayout;
