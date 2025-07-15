// import React, { useState, useEffect } from "react";

// const assessments = [
//   {
//     title: "ประเมินความเครียด",
//     code: "(ST5)",
//     image:
//       "https://i.pinimg.com/736x/a0/a4/5f/a0a45f9738e6b83296e5412e72e2ee2d.jpg",
//   },
//   {
//     title: "ประเมินโรคซึมเศร้า",
//     code: "(2Q)",
//     image:
//       "https://i.pinimg.com/736x/a0/a4/5f/a0a45f9738e6b83296e5412e72e2ee2d.jpg",
//   },
//   {
//     title: "ประเมินสุขภาพจิต",
//     code: "(PHQ-9)",
//     image:
//       "https://cdn-icons-png.flaticon.com/512/4501/4501637.png",
//   },
// ];

const AssessmentSlider: React.FC = () => {
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % assessments.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

  return (
    <section>
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold">แบบประเมินสุขภาพ</h2>
    <a href="#" className="text-blue-500 text-sm">ดูทั้งหมด</a>
  </div>

  <div className="grid grid-cols-2 gap-3 mt-2">
    {[
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
    ].map((item, index) => (
      <div
        key={index}
        className="bg-white rounded-xl shadow overflow-hidden"
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
