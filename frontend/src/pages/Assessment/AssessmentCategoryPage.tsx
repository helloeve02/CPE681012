import React from "react";
import { useNavigate } from "react-router-dom";

const healthSections = [
  {
    title: "สุขภาพทั่วไป",
    items: [{ label: "บันทึกสุขภาพและดัชนีมวลกาย", path: "/assessment/general" }],
  },
  {
    title: "โรคเสี่ยงพบบ่อย",
    items: [
      { label: "โรคเบาหวาน", path: "/assessment/diabetes" },
      { label: "โรคไต", path: "/assessment/kidney" },
    ],
  },
  {
    title: "ประเมินสุขภาพใจ",
    items: [
      { label: "ประเมินความเครียด (ST5)", path: "/assessment/stress" },
      { label: "ประเมินโรคซึมเศร้า (2Q)", path: "/assessment/depression" },
    ],
  },
];

const HealthAssessmentPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 flex flex-col items-center px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-xl text-white mb-6">
        <button onClick={() => navigate(-1)} className="text-xl hover:scale-110 transition">
          &larr;
        </button>
        <h1 className="text-lg font-bold text-center flex-1 -ml-6">ประเมินสุขภาพ</h1>
        <div className="w-6" />
      </div>

      {/* Content Box */}
      <div className="bg-white w-full max-w-xl rounded-t-2xl shadow-lg p-6 space-y-6 min-h-screen">
        {healthSections.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-sm font-bold text-gray-800 mb-2">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => navigate(item.path)}
                  className="w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl shadow-sm transition font-medium text-gray-700"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthAssessmentPage;
