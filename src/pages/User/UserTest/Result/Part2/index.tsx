import { useParams } from "react-router-dom";

type QuestionDetail = {
  content: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
};

const questionDetails: Record<string, QuestionDetail> = {
  "6": {
    content: `Power Outage Scheduled at City Hall

On Friday, April 14, the city hall’s electricity is scheduled to be shut down at 7 A.M. and restored at 6 P.M. The building -----
(131) for the day. During the power outage, the emergency lighting system will be upgraded. ----(132), all circuit panels will be replaced to bring them into compliance with current safety codes.

(133)-- exiting city hall offices on Thursday, please disconnect all desktop computers, wireless servers, and other computer—related equipment. Furthermore, employees are asked to remove any personal contents from the kitchenette.

(134). Please direct questions or concerns to the director of building maintenance.`,
    options: [
      { label: "A", text: "In that case" },
      { label: "B", text: "Regularly" },
      { label: "C", text: "Rather than" },
      { label: "D", text: "Specifically" },
    ],
    correctAnswer: "D",
    explanation: `Câu mang vai trò giải nghĩa chi tiết hơn cho câu trước đó, chọn từ có nghĩa phù hợp
A. Trong trường hợp đó
B. Đều đặn
C. Thay vì
D. Cụ thể
Tạm dịch/Mở rộng
Trong lúc cắt điện, hệ thống chiếu sáng khẩn cấp sẽ được nâng cấp. Cụ thể, tất cả bảng mạch sẽ được thay thế để đảm bảo đúng theo quy chuẩn an toàn hiện nay.`,
  },
  "7": {
    content: `Annual Employee Benefits Review

The annual benefits review meeting will be held next Wednesday at 3 P.M. in conference room B. All employees are encouraged to attend to learn about the changes in health insurance, retirement plans, and other benefits.`,
    options: [
      { label: "A", text: "Thursday" },
      { label: "B", text: "Next Wednesday" },
      { label: "C", text: "Friday" },
      { label: "D", text: "Next Monday" },
    ],
    correctAnswer: "B",
    explanation: `Cuộc họp đánh giá phúc lợi hàng năm sẽ được tổ chức vào thứ Tư tuần tới lúc 3 giờ chiều tại phòng họp B. Tất cả nhân viên nên tham dự để tìm hiểu về các thay đổi trong bảo hiểm y tế, kế hoạch nghỉ hưu và các phúc lợi khác.`,
  },
  "8": {
    content: `New Parking Regulations

Starting from July 1st, the parking regulations in the downtown area will change. Parking will be limited to two hours between 8 A.M. and 6 P.M. Monday through Friday. Vehicles parked longer than the allowed time will be subject to fines.`,
    options: [
      { label: "A", text: "Unlimited parking" },
      { label: "B", text: "No parking on weekends" },
      { label: "C", text: "Two-hour parking limit on weekdays" },
      { label: "D", text: "Free parking all day" },
    ],
    correctAnswer: "C",
    explanation: `Quy định đỗ xe mới bắt đầu từ ngày 1 tháng 7. Giới hạn đỗ xe là 2 giờ từ 8 giờ sáng đến 6 giờ chiều từ thứ Hai đến thứ Sáu. Xe đỗ lâu hơn thời gian cho phép sẽ bị phạt.`,
  },
  "9": {
    content: `Office Renovation Notice

The third floor office will undergo renovation starting August 15th. During the renovation, employees assigned to that floor will be temporarily relocated to the second floor. The renovation is expected to last six weeks.`,
    options: [
      { label: "A", text: "Starting August 1st" },
      { label: "B", text: "Starting August 15th" },
      { label: "C", text: "Starting September 1st" },
      { label: "D", text: "Starting July 30th" },
    ],
    correctAnswer: "B",
    explanation: `Thông báo cải tạo văn phòng tầng ba sẽ bắt đầu từ ngày 15 tháng 8. Trong thời gian cải tạo, nhân viên tầng ba sẽ tạm thời chuyển sang tầng hai. Dự kiến công việc cải tạo kéo dài sáu tuần.`,
  },
  "10": {
    content: `Customer Service Training

All new hires must attend the customer service training session scheduled for next Monday. The session will cover communication skills, complaint handling, and product knowledge.`,
    options: [
      { label: "A", text: "Next Tuesday" },
      { label: "B", text: "Next Monday" },
      { label: "C", text: "Next Friday" },
      { label: "D", text: "Next Wednesday" },
    ],
    correctAnswer: "B",
    explanation: `Tất cả nhân viên mới phải tham dự khóa đào tạo dịch vụ khách hàng được tổ chức vào thứ Hai tuần tới. Khóa học sẽ bao gồm kỹ năng giao tiếp, xử lý khiếu nại và kiến thức sản phẩm.`,
  },
};

const Part2Detail = () => {
  const { questionId } = useParams<{ questionId: string }>();

  const detail = questionDetails[questionId ?? "6"];

  if (!detail)
    return (
      <div className="p-5 max-w-3xl mx-auto font-sans">
        Câu hỏi không tồn tại
      </div>
    );

  return (
    <div className="p-5 max-w-3xl mx-auto font-sans">
      <h2 className="text-xl font-bold mb-3">Answer details: #{questionId}</h2>
      <div
        className="border rounded p-4 bg-gray-50 mb-4 whitespace-pre-wrap"
        style={{ whiteSpace: "pre-wrap" }}
      >
        <p>{detail.content}</p>
      </div>

      {/* render câu hỏi */}
      <div
        className="border rounded p-4 mb-6 max-w"
        style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
      >
        <p className="font-bold mb-2" style={{ color: "rgba(0,0,0,0.5)" }}>
          Câu {questionId}:
        </p>
        <ul
          className="list-disc list-inside space-y-2"
          style={{ paddingLeft: "1.25rem" }}
        >
          {detail.options.map((opt) => (
            <li
              key={opt.label}
              className="flex gap-2 items-center"
              style={{ color: "rgba(0, 157, 255, 0.5)", fontWeight: 600 }}
            >
              <span style={{ color: "rgba(0, 0, 0, 0.5)", fontWeight: 700 }}>
                {opt.label}.
              </span>
              <span>{opt.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <p
        className="font-semibold mb-2"
        style={{ color: "rgba(0, 255, 59, 0.5)", fontWeight: 600 }}
      >
        Đáp án đúng: Câu {detail.correctAnswer}
      </p>
      <p className="font-bold mb-2" style={{ color: "rgba(28, 51, 255, 0.5)" }}>
        Giải thích chi tiết đáp án
      </p>
      <p>{detail.explanation}</p>
    </div>
  );
};

export default Part2Detail;
