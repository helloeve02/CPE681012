import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Heart, 
  Activity, 
  User, 
  Target, 
  TrendingUp, 
  Shield 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DiabetesResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // รับข้อมูลที่ส่งมาจากหน้าก่อนหน้า
  const { formData, score } = location.state || {};

  // ถ้าไม่มีข้อมูล redirect กลับไปหน้าประเมิน
  if (!formData || score === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ไม่พบข้อมูลการประเมิน</h2>
          <button 
            onClick={() => navigate('/assessment/diabetesmoreassessmentpage')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            กลับไปประเมินใหม่
          </button>
        </div>
      </div>
    );
  }

  const getRiskLevel = (score: number) => {
    if (score <= 2) {
      return {
        level: 'น้อยกว่า หรือเท่ากับ 2',
        risk: 'น้อย',
        chance: '1 ใน 20',
        color: 'green',
        bgColor: 'from-green-500 to-emerald-500',
        textColor: 'text-green-600',
        bgLight: 'bg-green-50',
        recommendations: [
          'ออกกำลังกายสม่ำเสมอ',
          'ควบคุมน้ำหนักให้อยู่ในเกณฑ์ปกติ',
          'ตรวจวัดความดันโลหิตเป็นประจำ',
          'ประเมินความเสี่ยงอีกครั้งใน 3 ปี'
        ]
      };
    } else if (score >= 3 && score <= 5) {
      return {
        level: '3-5',
        risk: 'ปานกลาง',
        chance: '1 ใน 12',
        color: 'yellow',
        bgColor: 'from-yellow-500 to-amber-500',
        textColor: 'text-yellow-600',
        bgLight: 'bg-yellow-50',
        recommendations: [
          'ออกกำลังกายสม่ำเสมออย่างน้อย 150 นาทีต่อสัปดาห์',
          'ควบคุมน้ำหนักให้อยู่ในเกณฑ์ปกติ',
          'ตรวจวัดความดันโลหิตเป็นประจำ',
          'ประเมินความเสี่ยงอีกครั้งใน 1-3 ปี'
        ]
      };
    } else if (score >= 6 && score <= 8) {
      return {
        level: '6-8',
        risk: 'สูง',
        chance: '1 ใน 7',
        color: 'orange',
        bgColor: 'from-orange-500 to-red-500',
        textColor: 'text-orange-600',
        bgLight: 'bg-orange-50',
        recommendations: [
          'ปรับเปลี่ยนพฤติกรรมการกินและออกกำลังกายอย่างเข้มข้น',
          'ควบคุมน้ำหนักให้อยู่ในเกณฑ์ปกติ',
          'ตรวจวัดความดันโลหิตเป็นประจำ',
          'ตรวจระดับน้ำตาลในเลือด',
          'ประเมินความเสี่ยงอีกครั้งใน 1-3 ปี'
        ]
      };
    } else {
      return {
        level: 'มากกว่า 8',
        risk: 'สูงมาก',
        chance: '1 ใน 3-4',
        color: 'red',
        bgColor: 'from-red-600 to-rose-600',
        textColor: 'text-red-600',
        bgLight: 'bg-red-50',
        recommendations: [
          'ปรับเปลี่ยนพฤติกรรมการกินและออกกำลังกายอย่างเข้มข้น',
          'ควบคุมน้ำหนักให้อยู่ในเกณฑ์ปกติ',
          'ตรวจวัดความดันโลหิตเป็นประจำ',
          'ตรวจระดับน้ำตาลในเลือดโดยเร็ว',
          'ประเมินความเสี่ยงอีกครั้งในปีถัดไป'
        ]
      };
    }
  };

  const result = getRiskLevel(score);

  const getRiskIcon = () => {
    if (result.color === 'green') return <CheckCircle size={32} className="text-white" />;
    return <AlertTriangle size={32} className="text-white" />;
  };

  // คำนวณ BMI
  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100;
    if (weight && height) {
      return (weight / (height * height)).toFixed(1);
    }
    return 'N/A';
  };

  // คำนวณ BMI Status
  const getBMIStatus = () => {
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5) return 'น้ำหนักต่ำ';
    if (bmi < 23) return 'ปกติ';
    if (bmi < 25) return 'น้ำหนักเกิน';
    if (bmi < 30) return 'อ้วนระดับ 1';
    return 'อ้วนระดับ 2';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans">
      {/* Header */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${result.bgColor}`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate('/assessment/diabetesmoreassessmentpage')}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className="flex-1 text-center text-white font-bold text-xl">
              ผลการประเมินความเสี่ยง
            </h1>
            <div className="w-12" />
          </div>

          {/* Result Summary */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 border border-white/20">
              {getRiskIcon()}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
              คะแนน {score}
            </h2>
            <p className="text-2xl text-white/90 font-semibold mb-2">
              ระดับความเสี่ยง: {result.risk}
            </p>
            <p className="text-lg text-white/80">
              โอกาสเกิดเบาหวาน: {result.chance}
            </p>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        {/* Assessment Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-2 ${result.textColor} bg-opacity-10 rounded-lg`}>
                <Target size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">สรุปข้อมูลการประเมิน</h3>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Personal Info */}
              <div className={`${result.bgLight} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className={result.textColor} />
                  <span className="font-semibold text-gray-700">ข้อมูลส่วนตัว</span>
                </div>
                <p className="text-sm text-gray-600">อายุ: {formData.age} ปี</p>
                <p className="text-sm text-gray-600">เพศ: {formData.gender === 'male' ? 'ชาย' : 'หญิง'}</p>
              </div>

              {/* Physical Data */}
              <div className={`${result.bgLight} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={16} className={result.textColor} />
                  <span className="font-semibold text-gray-700">ข้อมูลทางกาย</span>
                </div>
                <p className="text-sm text-gray-600">BMI: {calculateBMI()} ({getBMIStatus()})</p>
                <p className="text-sm text-gray-600">รอบเอว: {formData.waist} ซม.</p>
              </div>

              {/* Health Data */}
              <div className={`${result.bgLight} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={16} className={result.textColor} />
                  <span className="font-semibold text-gray-700">ข้อมูลสุขภาพ</span>
                </div>
                <p className="text-sm text-gray-600">ความดัน: {formData.systolic}/{formData.diastolic} mmHg</p>
                <p className="text-sm text-gray-600">ประวัติครอบครัว: {formData.familyHistory === 'yes' ? 'มี' : 'ไม่มี'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg text-white">
                <Shield size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">คำแนะนำสำหรับคุณ</h3>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Level Explanation */}
        <div className={`bg-gradient-to-r ${result.bgColor} rounded-2xl p-6 text-white mb-8`}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex-shrink-0">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">ความหมายของผลลัพธ์</h3>
              <p className="text-white/90 leading-relaxed mb-3">
                คะแนนของคุณอยู่ในช่วง <span className="font-bold">{result.level}</span> 
                {' '}ซึ่งหมายความว่ามีโอกาสเป็นโรคเบาหวานประมาณ <span className="font-bold">{result.chance}</span>
              </p>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                <span>การประเมินนี้เป็นเพียงแนวทางเบื้องต้น ไม่ใช่การวินิจฉัยทางการแพทย์</span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800">รายละเอียดคะแนน</h3>
            <p className="text-gray-600 mt-1">การคำนวณคะแนนแบ่งตามปัจจัยเสี่ยงต่าง ๆ</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">อายุ {formData.age} ปี</span>
                <span className="text-gray-600">คะแนนจากอายุ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">เพศ{formData.gender === 'male' ? 'ชาย' : 'หญิง'}</span>
                <span className="text-gray-600">คะแนนจากเพศ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">BMI: {calculateBMI()}</span>
                <span className="text-gray-600">คะแนนจาก BMI</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">รอบเอว: {formData.waist} ซม.</span>
                <span className="text-gray-600">คะแนนจากรอบเอว</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">ความดัน: {formData.systolic}/{formData.diastolic}</span>
                <span className="text-gray-600">คะแนนจากความดัน</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">ประวัติครอบครัว: {formData.familyHistory === 'yes' ? 'มี' : 'ไม่มี'}</span>
                <span className="text-gray-600">คะแนนจากประวัติ</span>
              </div>
              <div className="border-t pt-3 mt-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg font-bold">
                  <span className="text-lg">คะแนนรวม</span>
                  <span className="text-xl text-indigo-600">{score} คะแนน</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <button
            onClick={() => navigate('/assessment/diabetesmoreassessmentpage')}
            className="bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:border-gray-400 hover:shadow-lg"
          >
            ประเมินใหม่อีกครั้ง
          </button>
          <button
            onClick={() => navigate('/')}
             
            className={`bg-gradient-to-r ${result.bgColor} text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
          >
            กลับไปหน้าหลัก
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 text-gray-700 mb-8">
          <h4 className="font-bold text-lg mb-3">สิ่งที่ควรรู้เพิ่มเติม</h4>
          <div className="space-y-2 text-sm">
            <p>• การประเมินนี้อิงจากแบบประเมินความเสี่ยงโรคเบาหวานของกรมควบคุมโรค</p>
            <p>• ผลลัพธ์เป็นการคาดการณ์เบื้องต้น ไม่ใช่การวินิจฉัยที่แน่นอน</p>
            <p>• แนะนำให้ตรวจสุขภาพประจำปีและปรึกษาแพทย์เป็นระยะ ๆ</p>
            <p>• การปรับเปลี่ยนพฤติกรรมสุขภาพสามารถลดความเสี่ยงได้</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiabetesResultPage;