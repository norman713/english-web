import logo from "./assets/user.png";
import bannerImage from "./assets/hero.png";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 shadow-md bg-white">
        <img src={logo} alt="Logo" className="w-14" />
        <ul className="flex space-x-6 text-lg font-semibold">
          <li className="text-orange-500 border-b-2 border-orange-500">Home</li>
          <li className="hover:text-orange-500">Vocabulary</li>
          <li className="hover:text-orange-500">Test</li>
          <li className="hover:text-orange-500">Login</li>
        </ul>
      </nav>

      {/* Banner */}
      <header className="relative grid grid-cols-3 items-center text-center py-12 bg-blue-100 px-8">
        <div>
          <img src={bannerImage} alt="Banner" className="w-full h-60 object-cover rounded-lg" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">✨ HỌC TIẾNG ANH ✨</h1>
          <p className="text-xl text-gray-600 mt-2">⭐ Dễ dàng và hiệu quả ⭐</p>
        </div>
        <div className="flex justify-center">
          <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition">
            Get Started Now
          </button>
        </div>
      </header>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-6 py-8">
        {[
          { title: "Smart Flashcard", desc: "Dễ dàng ôn luyện từ vựng với hệ thống thẻ thông minh." },
          { title: "Exam Preparation", desc: "Luyện tập và kiểm tra với các đề thi mô phỏng thực tế." },
          { title: "Learning Tracking", desc: "Theo dõi tiến trình học tập và đánh giá kết quả." },
          { title: "Personalized Learning", desc: "Lộ trình học cá nhân hóa theo cấp độ của bạn." },
          { title: "Exam Discussion", desc: "Thảo luận và chia sẻ kinh nghiệm về các kỳ thi." },
        ].map((feature, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center">
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

export default App;