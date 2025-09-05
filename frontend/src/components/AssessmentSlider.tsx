import React from "react";

const AssessmentSlider: React.FC = () => {
  const assessments = [
    {
      title: "ดัชนีมวลกาย",
      code: "(BMI)",
      image: "https://healthsciencesforum.com/wp-content/uploads/2023/07/image2-7-1024x577.jpg",
      gradient: "from-blue-500 to-blue-600",
      accent: "text-blue-600",
      path: "/assessment/information/bmi",
    },
    {
      title: "โรคเบาหวาน",
      code: "(PHQ-9)",
      image: "https://www.jomtienhospital.com/uploads/editor/images/Articles/Diabetes%20mellitus/%E0%B9%80%E0%B8%9A%E0%B8%B2%E0%B8%AB%E0%B8%A7%E0%B8%B2%E0%B8%99%20%E0%B9%82%E0%B8%A3%E0%B8%84%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%87%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B8%A7%E0%B8%9A%E0%B8%84%E0%B8%B8%E0%B8%A12.jpg",
      gradient: "from-indigo-500 to-indigo-600",
      accent: "text-indigo-600",
      path: "/assessment/selectagerange",
    },
    {
      title: "โรคไต",
      code: "(2Q)",
      image: "https://nowserving.ph/blog/wp-content/uploads/2023/12/acute-cystitis-diagnosis.jpg",
      gradient: "from-pink-500 to-pink-600",
      accent: "text-pink-600",
      path: "/assessment/kidneyriskassessmentpage",
    },
    {
      title: "โรคซึมเศร้า",
      code: "(PHQ-9)",
      image: "https://mpics.mgronline.com/pics/Images/565000006153801.JPEG",
      gradient: "from-green-500 to-green-600",
      accent: "text-green-600",
      path: "/assessment/depression",
    },
  ];

  return (
    <section className="relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <h2 className="text-2xl font-bold text-gray-800 relative">
            แบบประเมินสุขภาพ
            <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </h2>
          <p className="text-gray-600 text-sm mt-3">เลือกแบบประเมินที่เหมาะสมกับคุณ</p>
        </div>
        <a
          href="/selectassessmentcategorypage"
          className="group relative text-blue-600 text-sm font-medium hover:text-blue-700 transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-50"
        >
          <span className="relative z-10">ดูทั้งหมด</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Assessment Cards */}
      <div className="flex gap-6 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-8 sm:overflow-visible pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {assessments.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className="group min-w-[200px] sm:min-w-0 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex-shrink-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative transform perspective-1000"
            style={{
              animation: `slideIn 0.8s ease-out ${index * 0.15}s both`
            }}
          >
            {/* Image Section - เต็มพื้นที่ด้านบน */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              
              {/* Gradient Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Code Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className={`${item.accent} bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold shadow-sm`}>
                  {item.code}
                </span>
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
            </div>

            {/* Content Section */}
            <div className="p-5 relative">
              <h3 className="font-bold text-base text-gray-800 group-hover:text-gray-900 transition-colors duration-300 leading-6 mb-2">
                {item.title}
              </h3>
              
              {/* Action Indicator */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">เริ่มประเมิน</span>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${item.gradient} group-hover:w-full transition-all duration-500 ease-out`}></div>
          </a>
        ))}
      </div>

    </section>
  );
};

export default AssessmentSlider;