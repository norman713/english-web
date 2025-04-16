import { useState } from "react";
import { NavLink } from "react-router-dom";

interface TabProps {
  labels: string[];
  paths: string[]; // Thêm thuộc tính paths để điều hướng
}

const Tab = ({ labels, paths }: TabProps) => {
  const [activeTab, setActiveTab] = useState(0); // Tab mặc định là cái đầu tiên

  // Hàm xử lý khi click vào tab
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="flex gap-[29px]">
      {labels.map((label, index) => (
        <NavLink
          key={index}
          to={paths[index]} // Điều hướng đến đường dẫn tương ứng
          className={({ isActive }) =>
            `cursor-pointer rounded-[30px] py-[9px] px-[23px] ${
              isActive
                ? "bg-[#B9EEFD] text-[#289AC0]"
                : "bg-white text-[#289AC0]"
            } from-inter-500 text-[22px] font-normal`
          }
          onClick={() => handleTabClick(index)}
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
};

export default Tab;
