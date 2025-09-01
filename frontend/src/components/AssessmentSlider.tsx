import React from "react";

const AssessmentSlider: React.FC = () => {
  const assessments = [
    {
      title: "ดัชนีมวลกาย",
      code: "(BMI)",
      image: "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
      bg: "from-blue-50 to-blue-100",
      accent: "text-blue-600",
      border: "border-blue-200",
      path: "/assessment/information/bmi",
    },
    {
      title: "โรคเบาหวาน",
      code: "(PHQ-9)",
      image: "https://cdn-icons-png.flaticon.com/512/4501/4501637.png",
      bg: "from-indigo-50 to-indigo-100",
      accent: "text-indigo-600",
      border: "border-indigo-200",
      path: "/assessment/selectagerange",
    },
    {
      title: "โรคไต",
      code: "(2Q)",
      image: "https://i.pinimg.com/736x/a0/a4/5f/a0a45f9738e6b83296e5412e72e2ee2d.jpg",
      bg: "from-pink-50 to-pink-100",
      accent: "text-pink-600",
      border: "border-pink-200",
      path: "/assessment/kidneyriskassessmentpage",
    },
    {
      title: "ประเมินพฤติกรรม",
      code: "(XYZ)",
      image: "https://cdn-icons-png.flaticon.com/512/4329/4329443.png",
      bg: "from-green-50 to-green-100",
      accent: "text-green-600",
      border: "border-green-200",
      path: "/assessment/behavior",
    },
  ];

  return (
    <section className="relative">
      {/* Header Section with enhanced styling */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <h2 className="text-xl font-bold text-gray-800 relative">
            แบบประเมินสุขภาพ
            <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </h2>
        </div>
        <a
          href="/selectassessmentcategorypage"
          className="group relative text-blue-600 text-sm font-medium hover:text-blue-700 transition-all duration-300"
        >
          <span className="relative z-10">ดูทั้งหมด</span>
          <svg 
            className="inline-block w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </a>
      </div>

      {/* Assessment Cards */}
      <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 sm:overflow-visible pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {assessments.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className="group min-w-[160px] sm:min-w-0 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex-shrink-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative"
            style={{
              animation: `slideIn 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            {/* Card Content */}
            <div className="relative overflow-hidden">
              {/* Top Section with Text */}
              <div className="p-4 relative z-10">
                <h3 className="font-semibold text-sm text-gray-800 group-hover:text-gray-900 transition-colors duration-300 leading-5">
                  {item.title}
                </h3>
                <p className={`text-xs font-medium mt-1 ${item.accent} bg-white/80 px-2 py-1 rounded-full inline-block`}>
                  {item.code}
                </p>
              </div>

              {/* Image Section with Gradient Background */}
              <div className={`bg-gradient-to-br ${item.bg} p-6 relative overflow-hidden border-t ${item.border}`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/30"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-white/20"></div>
                  <div className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-white/10 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-20 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500 filter group-hover:brightness-110"
                  loading="lazy"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
            </div>
          </a>
        ))}
      </div>

    </section>
  );
};

export default AssessmentSlider;