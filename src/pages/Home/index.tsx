// home list
import logo from "../../assets/user.png";
import bannerImage from "../../assets/hero.png";
import Navbar from "../../components/NavBar/NavBar";
import Button from "../../components/Button/Button";
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
            className="w-full h-full object-cover transform scale-x-100" // scale-x-110 để phóng to chiều ngang
          />
        </div>
        <div>
          <h1 className="text-4xl banner-text">✨ LEARNING ENGLISH ✨</h1>
          <p className="text-xl banner-text text-gray-600 mt-2 font-bold">
            ⭐ Easy and effective⭐
          </p>
        </div>
        <div>
          <Button text={" Get Started Now"}></Button>
        </div>
      </header>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-6 py-8">
        {[
          {
            title: "Smart Flashcard",
            desc: "Dễ dàng ôn luyện từ vựng với hệ thống thẻ thông minh.",
          },
          {
            title: "Exam Preparation",
            desc: "Luyện tập và kiểm tra với các đề thi mô phỏng thực tế.",
          },
          {
            title: "Learning Tracking",
            desc: "Theo dõi tiến trình học tập và đánh giá kết quả.",
          },
          {
            title: "Personalized Learning",
            desc: "Lộ trình học cá nhân hóa theo cấp độ của bạn.",
          },
          {
            title: "Exam Discussion",
            desc: "Thảo luận và chia sẻ kinh nghiệm về các kỳ thi.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md text-center"
          >
            <h2 className="text-lg font-semibold">{feature.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-8 mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
          <div>
            <img src={logo} alt="Logo" className="w-16 mb-2" />
          </div>
          <div>
            <h3 className="font-semibold">Pages</h3>
            <p>Home</p>
            <p>About Us</p>
            <p>Contact</p>
          </div>
          <div>
            <h3 className="font-semibold">Resources</h3>
            <p>Flashcards</p>
            <p>Exam Bank</p>
            <p>Statistics</p>
          </div>
          <div>
            <h3 className="font-semibold">Contact</h3>
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
