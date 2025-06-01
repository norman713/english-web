import { useParams } from "react-router-dom";

const UserTestResultPage = () => {
  const { id } = useParams();

  // Dữ liệu demo kết quả
  const totalQuestions = 10;
  const correctAnswers = 5;
  const wrongAnswers = 2;
  const skippedAnswers = 3;
  const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(0);
  const timeSpentMinutes = 120;

  const partsResult = [
    {
      partNumber: 1,
      questions: [
        { id: 1, userAnswer: "D", correct: true },
        { id: 2, userAnswer: "D", correct: true },
        { id: 3, userAnswer: "C", correct: false },
        { id: 4, userAnswer: "C", correct: false },
        { id: 5, userAnswer: null, correct: null }, // bỏ qua
      ],
    },
    {
      partNumber: 2,
      questions: [
        { id: 6, userAnswer: "D", correct: true },
        { id: 7, userAnswer: "D", correct: true },
        { id: 8, userAnswer: "C", correct: false },
        { id: 9, userAnswer: "C", correct: false },
        { id: 10, userAnswer: null, correct: null },
      ],
    },
    {
      partNumber: 3,
      questions: [
        { id: 11, userAnswer: "D", correct: true },
        { id: 12, userAnswer: "D", correct: true },
        { id: 13, userAnswer: "C", correct: false },
        { id: 14, userAnswer: "C", correct: false },
        { id: 15, userAnswer: null, correct: null },
      ],
    },
  ];

  // Render trạng thái câu trả lời
  const renderAnswerStatus = (correct: boolean | null) => {
    if (correct === true)
      return <span className="text-green-600 font-bold ml-1">✓</span>;
    if (correct === false)
      return <span className="text-red-600 font-bold ml-1">✗</span>;
    return <span className="text-gray-500 font-bold ml-1">∅</span>;
  };

  return (
    <div className="p-5 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Kết quả bài thi ID: {id}</h1>

      {/* Số câu đúng, sai, bỏ qua */}
      <div className="flex gap-8 mb-6 justify-center">
        <div className="bg-green-100 rounded-lg px-10 py-6 text-center font-bold text-2xl text-green-800">
          {correctAnswers}
          <div className="text-base font-normal">đúng</div>
        </div>
        <div className="bg-red-100 rounded-lg px-10 py-6 text-center font-bold text-2xl text-red-600">
          {wrongAnswers}
          <div className="text-base font-normal">sai</div>
        </div>
        <div className="bg-blue-100 rounded-lg px-10 py-6 text-center font-bold text-2xl text-blue-600">
          {skippedAnswers}
          <div className="text-base font-normal">bỏ qua</div>
        </div>
      </div>

      {/* Tóm tắt kết quả */}
      <div className="mb-6">
        <div className="text-blue-300 font-semibold text-lg mb-2 text-[25px]">
          Tóm tắt kết quả
        </div>
        <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm font-semibold text[20px] ">
          <li>
            Kết quả làm bài{" "}
            <span className="text-blue-300">
              {correctAnswers}/{totalQuestions}
            </span>
          </li>
          <li>
            Độ chính xác <span className="text-blue-300">{accuracy}%</span>
          </li>
          <li>
            Thời gian hoàn thành{" "}
            <span className="text-blue-300">{timeSpentMinutes} phút</span>
          </li>
        </ul>
      </div>

      {/* Chi tiết từng phần */}
      {partsResult.map((part) => (
        <div key={part.partNumber} className="mb-6 text-sm">
          <div className="font-semibold mb-2">Part {part.partNumber}:</div>
          <div className="flex flex-wrap gap-2">
            {part.questions.map((q, idx) => (
              <div
                key={q.id}
                className="flex items-center gap-1 whitespace-nowrap"
              >
                <span className="inline-block w-6 h-6 text-center rounded-full bg-blue-100 text-blue-700 font-bold leading-6">
                  {idx + 1}
                </span>
                <span className="font-bold text-gray-800 select-none">
                  {q.userAnswer !== null ? `${q.userAnswer}:` : "–"}
                </span>
                {renderAnswerStatus(q.correct)}
                <a
                  href={`/user/test/part${part.partNumber}/detail/${q.id}`}
                  className="ml-1 underline font-bold"
                  style={{ color: "rgba(0, 157, 255, 0.5)" }} // Màu #009DFF 50% opacity
                >
                  [chi tiết]
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserTestResultPage;
