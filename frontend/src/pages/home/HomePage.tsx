import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import AssessmentSlider from "../../components/AssessmentSlider";

const images = [
  {
    src: "https://tse4.mm.bing.net/th/id/OIP.XWD1OnmEjX7ZtDUi0joMeQHaDt?rs=1&pid=ImgDetMain&o=7&rm=3",
    alt: "ข่าวสาร 1",
  },
  {
    src: "https://www.zolitic.com/media/65794978496a6f314c434979496a6f7a4e546b334e7977694d7949364d5377694e5349364f4455774c434932496a6f314d546839.png",
    alt: "ข่าวสาร 2",
  },
  {
    src: "https://www.rama.mahidol.ac.th/ramachannel/wp-content/uploads/elementor/thumbs/1_%E0%B9%84%E0%B8%95%E0%B8%A7%E0%B8%B2%E0%B8%A2%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B8%B0%E0%B8%AA%E0%B8%B8%E0%B8%94%E0%B8%97%E0%B9%89%E0%B8%B2%E0%B8%A2-%E0%B8%84%E0%B8%A7%E0%B8%A3%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%84%E0%B8%A3_1-qdxmo2f93n6ht7aq0work68fw6ylo7gfjatdp6gt0g.jpg",
    alt: "ข่าวสาร 3",
  },
];

const HomePage: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 w-full max-w-7xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      {/* Layout split for large screens */}
      <div className="space-y-6">
        {/* ข่าวสาร Section */}
        <section >
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-semibold">ข่าวสาร</h2>
            <Link to="selectnewscategorypage" className="text-blue-500 text-sm hover:underline">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="mt-2 relative">
            <img
              src={images[current].src}
              alt={images[current].alt}
              className="w-full h-40 sm:h-52 md:h-64 lg:h-80 object-cover rounded-lg transition-all duration-500"
            />
            <div className="flex justify-center mt-2 space-x-2">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full ${current === idx ? "bg-gray-600" : "bg-gray-300"
                    }`}
                ></span>
              ))}
            </div>
          </div>
        </section>

        {/* รายการแนะนำ Section */}
        <section >
          <h2 className="text-base sm:text-lg font-semibold mb-2">รายการแนะนำ</h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {[
              { title: "โภชนาการที่เหมาะกับคุณ", icon: "📄", path: "/nutrition" },
              { title: "เมนูอาหารแนะนำ", icon: "📝", path: "/menu" },
              { title: "แผนมื้ออาหาร", icon: "🗓️", path: "/meal-plan" },
            ].map((item, index) => (
              <Link to={item.path} key={index} className="h-full">
                <div className="bg-white p-3 sm:p-4 rounded-lg shadow flex flex-col items-center justify-center h-full min-h-[120px] hover:bg-gray-100 transition">
                  <div className="text-2xl sm:text-3xl">{item.icon}</div>
                  <p className="text-center text-sm sm:text-base lg:text-lg mt-1">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* แบบประเมินสุขภาพ */}
      <AssessmentSlider />
    </div>
  );
};

export default HomePage;
