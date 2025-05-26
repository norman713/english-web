import { Outlet, Navigate } from "react-router-dom";

const TestLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default TestLayout;
