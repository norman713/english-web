import { useState } from "react";

interface TabProps {
  labels: string[];
}

const Tab = ({ labels }: TabProps) => {
  const [activeTab, setActiveTab] = useState(0); // Tab mặc định là cái đầu tiên

  // Hàm xử lý khi click vào tab
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className=" flex gap-[29px] ">
      {labels.map((label, index) => (
        <div
          key={index}
          onClick={() => handleTabClick(index)}
          className={`cursor-pointer rounded-[30px] py-[9px] px-[23px]
            ${
              activeTab === index
                ? "bg-[#B9EEFD] text-[#289AC0]"
                : "bg-white text-[#289AC0]"
            }
            from-inter-500 text-[25px] font-normal`}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default Tab;
