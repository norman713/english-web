import { Outlet } from "react-router-dom";
const TestLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default TestLayout;
