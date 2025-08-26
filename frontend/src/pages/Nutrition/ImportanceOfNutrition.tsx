import { IoFishOutline } from "react-icons/io5";
import { LuApple, LuDroplets } from "react-icons/lu";
import { PiBreadDuotone } from "react-icons/pi";

const data = [
  {
    title: "คาร์โบไฮเดรต",
    icon: <PiBreadDuotone size={30} />,
    duty: "พลังงานหลัก",
    source: "ข้าว แป้ง",
    insufficient: "ไม่มีแรงสลายกล้ามาเป็นพลังงาน",
    minerals: "ทั้งฟอสฟอรัส และโพแทสเซืยม โซเดียม",
  },
  {
    title: "เกลือแร่ วิตามิน",
    icon: <LuApple size={30} />,
    duty: "ร่างกายทำงานปกติ มีใยอาหารช่วยในการขับถ่าย",
    source: "ผัก ผลไม้",
    insufficient: "ท้องผูก เกลือแร่ต่ำ",
    minerals: "โพแทสเซียม โซเดียม",
  },
  {
    title: "โปรตีน",
    icon: <IoFishOutline size={30} />,
    duty: "ซ่อมแซมเสริมสร้าง ส่วนที่สึกหรอ",
    source: "นม เนื้อสัวต์ต่างๆ ไข่ ถั่ว",
    insufficient: "เจ็บป่วยง่าย ฟื้นไข้ช้า กล้ามเนื้อฟ่อ",
    minerals: "ฟอสฟอรัส โซเดียม",
  },
  {
    title: "พลังงาน",
    icon: <LuDroplets size={30} />,
    duty: "ร่างกายทำงานปกติ",
    source: "น้ำมัน น้ำตาล เกลือซีอิ๊ว น้ำปลา",
    insufficient: "ร่างกายผิดปกติ อ่อนเพลีย มักเกินมากกว่าขาด",
    minerals: "โซเดียม โพแทสเซียม",
  },
];

const ImportanceOfNutrition = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 font-kanit flex flex-col items-center py-8">
      <h1 className="text-white text-xl md:text-2xl font-semibold text-center mb-8">
        ความสำคัญของโภชนาการ
      </h1>

      <div className="px-10 sm:px-10">
        <div className="bg-white rounded-2xl sm:p-8 md:p-5 w-full max-w-[700px] mx-auto">
          {data.map((item, index) => (
            <div
              key={index}
              className="rounded-xl p-4 mb-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center text-blue-500">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-md font-semibold text-black mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">หน้าที่:</span>{" "}
                  {item.duty}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">แหล่งอาหาร:</span>{" "}
                  {item.source}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">หากทานไม่เพียงพอ:</span>{" "}
                  {item.insufficient}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">เกลือแร่ที่มีมาก:</span>{" "}
                  {item.minerals}
                </p>
              </div>
              <button className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors">
                แนะนำ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ImportanceOfNutrition;
