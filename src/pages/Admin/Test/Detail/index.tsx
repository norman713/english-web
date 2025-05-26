import { useParams } from "react-router-dom";

const TestDetailPage = () => {
  const { id } = useParams();

  // Mock data
  const testDetail = {
    title: "2024 Toeic Test",
    testTime: "90 phút",
    testType: "Toeic",
    creator: "Admin",
    createdAt: "22/05/2025",
    updatedAt: "22/05/2025",
    updatedBy: "Admin",
    version: "1.0",
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#31373F] mb-6 p-3">
        Chi tiết bộ đề thi <span className="text-blue-600">ID: {id}</span>
      </h1>

      <div className="bg-[#7CC8F680] p-4 px-[200px] space-y-2">
        <Field label="Tên" value={testDetail.title} />
        <Field label="Thời gian" value={testDetail.testTime} />
        <Field label="Chủ đề" value={testDetail.testType} />
        <Field label="Người tạo" value={testDetail.creator} />
        <Field label="Ngày tạo" value={testDetail.createdAt} />
        <Field label="Chỉnh lần cuối" value={testDetail.updatedAt} />
        <Field label="Người chỉnh" value={testDetail.updatedBy} />
        <Field label="Phiên bản" value={testDetail.version} />
      </div>
    </div>
  );
};

// Component field
const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-blue-800 font-semibold text-[16px]">{label}</p>
    <div className="bg-[#EEF5FF] rounded-full px-4 py-1 text-gray-600">
      {value}
    </div>
  </div>
);

export default TestDetailPage;
