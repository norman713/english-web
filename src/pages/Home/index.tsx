// home list
import bannerImage from "../../assets/hero.png";
import Navbar from "../../components/NavBar/NavBar";
import Button from "../../components/Button/Button";
import FeatureCard from "../../components/Features";
import {
  BookOpenCheck,
  ChartNoAxesColumnIncreasing,
  FileText,
  Info,
  MessageSquareMore,
  Pin,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col text-gray-900">
      {/* Navbar */}
      <Navbar />
      {/* Banner */}
      <header
        className="relative grid grid-cols-3 items-center text-center"
        style={{ backgroundColor: "rgba(169, 201, 227, 0.23)" }}
      >
        <div>
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-full object-cover transform scale-x-100"
          />
        </div>
        <div>
          <h1 className="text-4xl banner-text  text-[#2D89FF]">
            ✨ LEARNING ENGLISH ✨
          </h1>
          <p className="text-xl banner-text text-[#FFB400] mt-2 font-bold">
            ⭐ Easy and effective⭐
          </p>
        </div>
        <div>
          <Button text={" Get Started Now"}></Button>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 px-8 grid grid-cols-1 md:grid-cols-5 gap-6">
        <FeatureCard
          icon={FileText}
          title="Smart Flashcard"
          content="Ôn tập từ vựng hiệu quả với hệ thống flashcards thông minh giúp ghi nhớ lâu hơn."
          bgColor="bg-[#F3F7FF]"
        />
        <FeatureCard
          icon={BookOpenCheck}
          title="Exam Preparation System"
          content="Làm bài kiểm tra với nhiều cấp độ, kiểm tra trình độ qua hệ thống đề thi."
          bgColor="bg-[#FFF3E6]"
        />
        <FeatureCard
          icon={ChartNoAxesColumnIncreasing}
          title="Learning Progress Tracking"
          content="Theo dõi tiến trình học qua biểu đồ thông kê rõ ràng, cải thiện chiến lược ôn tập."
          bgColor="bg-[#E6F7E6]"
        />
        <FeatureCard
          icon={Pin}
          title="Personalized Learning Path"
          content="Xem tiến trình học cá nhân, từ vựng đã học, bài test đã hoàn thành."
          bgColor="bg-[#F7E6FF]"
        />
        <FeatureCard
          icon={MessageSquareMore}
          title="Exam Discussion & Comments"
          content="Thảo luận cùng cộng đồng, đặt câu hỏi và giải đáp thắc mắc về bài thi."
          bgColor="bg-[#FFE6E6]"
        />
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-8 mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[#2F2F68]">
          <div>
            <Info size={60} />
          </div>
          <div>
            <h4 className="font-bold text-[20px]">Pages</h4>
            <p>Home</p>
            <p>About Us</p>
            <p>Contact</p>
          </div>
          <div>
            <h3 className="font-bold text-[20px]">Resources</h3>
            <p>Flashcards</p>
            <p>Exam Bank</p>
            <p>Statistics</p>
          </div>
          <div>
            <h3 className="font-bold text-[20px]">Contact</h3>
            <p>📍 123 Main Street, Hanoi, Vietnam</p>
            <p>📧 support@englishweb.com</p>
            <p>📞 +84 911 520 235</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
