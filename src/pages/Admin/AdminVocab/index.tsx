import { Outlet } from "react-router-dom";
const AdminVocabLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminVocabLayout;
