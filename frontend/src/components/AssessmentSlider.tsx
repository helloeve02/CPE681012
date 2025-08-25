import React from "react";
import { Link } from "react-router-dom";

const AssessmentSlider: React.FC = () => {
  const assessments = [
    {
      title: "ประเมินความเครียด",
      code: "(ST5)",
      image: "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
      bg: "bg-blue-100",
    },
    {
      title: "ประเมินสุขภาพจิต",
      code: "(PHQ-9)",
      image: "https://cdn-icons-png.flaticon.com/512/4501/4501637.png",
      bg: "bg-indigo-100",
    },
    {
      title: "ประเมินโรคซึมเศร้า",
      code: "(2Q)",
      image:
        "https://i.pinimg.com/736x/a0/a4/5f/a0a45f9738e6b83296e5412e72e2ee2d.jpg",
      bg: "bg-pink-100",
    },
    {
      title: "ประเมินพฤติกรรม",
      code: "(XYZ)",
      image: "https://cdn-icons-png.flaticon.com/512/4329/4329443.png",
      bg: "bg-green-100",
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">แบบประเมินสุขภาพ</h2>
        <Link
          to="/selectassessmentcategorypage"
          className="text-blue-500 text-sm hover:underline"
        >
          ดูทั้งหมด
        </Link>
      </div>

      {/* ✅ บนมือถือเลื่อน, บนจอใหญ่เป็น Grid */}
      <div className="flex gap-3 mt-2 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-3 sm:overflow-visible">
        {assessments.map((item, index) => (
          <div
            key={index}
            className="min-w-[150px] sm:min-w-0 bg-white rounded-xl shadow overflow-hidden flex-shrink-0"
          >
            <div className="p-3">
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-xs text-gray-600">{item.code}</p>
            </div>
            <div className={`${item.bg} p-2`}>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-24 object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AssessmentSlider;
