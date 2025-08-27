import React, { useState, useEffect } from 'react';
import { Calculator, Droplets, User, AlertCircle, Info, Heart, Activity, RefreshCw, Target, TrendingUp, CheckCircle, Clock } from 'lucide-react';

interface PatientData {
  weight: number;
  age: number;
  gender: 'male' | 'female';
  // CKD specific
  ckdStage: number;
  urineOutput: number;
  edema: boolean;
  hypertension: boolean;
  heartFailure: boolean;
  // Diabetes specific
  diabetesType: number;
  hba1c: number;
  bloodPressure: { systolic: number; diastolic: number };
  diabeticComplications: {
    nephropathy: boolean;
    retinopathy: boolean;
    neuropathy: boolean;
    cardiovascular: boolean;
  };
  medications: {
    diuretics: boolean;
    acei: boolean;
    insulin: boolean;
  };
}

type CalculationType = 'ckd' | 'diabetes';

function Badge({ tone = "gray", children }: { tone?: "green" | "yellow" | "red" | "gray"; children: React.ReactNode }) {
  const map = {
    green: "bg-gradient-to-r from-emerald-100 to-green-100 text-green-700 ring-green-300 shadow-sm",
    yellow: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 ring-yellow-300 shadow-sm",
    red: "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 ring-red-300 shadow-sm",
    gray: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 ring-gray-300 shadow-sm",
  } as const;
  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ring-1 ${map[tone]}`}>
      {children}
    </span>
  );
}

function Progress({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  let tone: "green" | "yellow" | "red" = "green";
  if (pct >= 100 || value > max) tone = "red"; 
  else if (pct >= 80) tone = "yellow"; 
  else tone = "green";
  
  const barTone = {
    green: "bg-gradient-to-r from-emerald-400 to-green-500",
    yellow: "bg-gradient-to-r from-yellow-400 to-amber-500",
    red: "bg-gradient-to-r from-red-400 to-pink-500",
  }[tone];
  
  return (
    <div className="w-full">
      {label && <div className="mb-3 text-sm text-gray-600 flex items-center gap-2">
        <Target size={16} />
        {label}
      </div>}
      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div className={`h-4 ${barTone} transition-all duration-700 ease-out shadow-sm`} 
             style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {Math.round(value).toLocaleString()} / {max.toLocaleString()} ml
        </span>
        <span className={`text-sm font-medium ${
          tone === 'green' ? 'text-green-600' : 
          tone === 'yellow' ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

const FluidCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<CalculationType>('ckd');
  
   
   const defaultPatientData: PatientData = {
    weight: 0,
    age: 0,
    gender: 'male',
    // CKD
    ckdStage: 0,
    urineOutput: 0,
    edema: false,
    hypertension: false,
    heartFailure: false,
    // Diabetes
    diabetesType: 0,
    hba1c: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    diabeticComplications: {
      nephropathy: false,
      retinopathy: false,
      neuropathy: false,
      cardiovascular: false,
    },
    medications: {
      diuretics: false,
      acei: false,
      insulin: false,
    }
  };

  const [patientData, setPatientData] = useState<PatientData>({ ...defaultPatientData });

  const [result, setResult] = useState<{
    dailyFluidLimit: number;
    recommendations: string[];
    riskLevel: 'low' | 'moderate' | 'high';
    additionalInfo?: string[];
  } | null>(null);

  const calculateCKDFluidLimit = () => {
    let baseFluid = 0;
    
    // คำนวณตามปัสสาวะที่ออกใน 24 ชั่วโมง + 500-750 ml
    let fluidFromUrine = patientData.urineOutput + 600;
    
    // ปรับตาม CKD Stage
    let stageMultiplier = 1;
    switch (patientData.ckdStage) {
      case 1:
      case 2:
        stageMultiplier = 1.0;
        break;
      case 3:
        stageMultiplier = 0.9;
        break;
      case 4:
        stageMultiplier = 0.8;
        break;
      case 5:
        stageMultiplier = 0.7;
        break;
    }
    
    baseFluid = fluidFromUrine * stageMultiplier;
    
    // ปรับตามน้ำหนัก (30-35 ml/kg สำหรับผู้ป่วยไต)
    const weightBasedFluid = patientData.weight * 30;
    baseFluid = Math.min(baseFluid, weightBasedFluid);
    
    // ปรับตามภาวะแทรกซ้อน
    if (patientData.edema) baseFluid *= 0.8;
    if (patientData.hypertension) baseFluid *= 0.9;
    if (patientData.heartFailure) baseFluid *= 0.7;
    
    return baseFluid;
  };

  const calculateDiabetesFluidLimit = () => {
    // เริ่มจากน้ำหนักตัว 35-40 ml/kg สำหรับผู้ป่วยเบาหวาน
    let baseFluid = patientData.weight * 35;
    
    // ปรับตามอายุ
    if (patientData.age > 65) baseFluid *= 0.9;
    if (patientData.age > 75) baseFluid *= 0.85;
    
    // ปรับตาม HbA1c
    if (patientData.hba1c > 9.0) baseFluid *= 1.1; // ควบคุมไม่ดี เพิ่มน้ำ
    if (patientData.hba1c > 11.0) baseFluid *= 1.2;
    
    // ปรับตามความดันโลหิต
    const { systolic, diastolic } = patientData.bloodPressure;
    if (systolic > 140 || diastolic > 90) baseFluid *= 0.9;
    if (systolic > 160 || diastolic > 100) baseFluid *= 0.85;
    
    // ปรับตามภาวะแทรกซ้อน
    if (patientData.diabeticComplications.nephropathy) baseFluid *= 0.8;
    if (patientData.diabeticComplications.cardiovascular) baseFluid *= 0.85;
    if (patientData.diabeticComplications.retinopathy && patientData.hba1c > 8.5) baseFluid *= 0.95;
    
    // ปรับตามยา
    if (patientData.medications.diuretics) baseFluid *= 0.9;
    if (patientData.medications.acei && (systolic > 140 || diastolic > 90)) baseFluid *= 0.95;
    
    return baseFluid;
  };

  const getCKDRecommendations = (fluidLimit: number) => {
    const recommendations = [];
    
    if (patientData.ckdStage >= 4) {
      recommendations.push('ควรปรึกษาแพทย์เฉพาะทางไตอย่างใกล้ชิด');
    }
    
    if (patientData.edema) {
      recommendations.push('หลีกเลี่ยงอาหารเค็ม และชั่งน้ำหนักทุกวัน');
    }
    
    if (patientData.hypertension) {
      recommendations.push('ควบคุมความดันโลหิตและจำกัดเกลือ');
    }
    
    if (patientData.heartFailure) {
      recommendations.push('ควรจำกัดน้ำอย่างเข้มงวดและติดตามอาการหายใจขัด');
    }
    
    if (fluidLimit < 1000) {
      recommendations.push('ปริมาณน้ำน้อยมาก ควรปรึกษาแพทย์');
    }
    
    recommendations.push('หลีกเลี่ยงผลไม้ที่มีโปแตสเซียมสูง');
    recommendations.push('แบ่งดื่มน้ำตลอดวัน ไม่ดื่มครั้งเดียวมาก');
    
    return recommendations;
  };

  const getDiabetesRecommendations = (fluidLimit: number) => {
    const recommendations = [];
    
    if (patientData.hba1c > 9.0) {
      recommendations.push('ควบคุมระดับน้ำตาลในเลือดให้ดีขึ้น ปรึกษาแพทย์เพื่อปรับยา');
    }
    
    if (patientData.bloodPressure.systolic > 140 || patientData.bloodPressure.diastolic > 90) {
      recommendations.push('ควบคุมความดันโลหิตให้อยู่ในเกณฑ์ปกติ');
    }
    
    if (patientData.diabeticComplications.nephropathy) {
      recommendations.push('มีภาวะไตเสื่อม ควรจำกัดโปรตีนและเกลือ');
    }
    
    if (patientData.diabeticComplications.cardiovascular) {
      recommendations.push('มีภาวะหัวใจและหลอดเลือด ควรจำกัดเกลือและไขมันอิ่มตัว');
    }
    
    if (patientData.medications.insulin) {
      recommendations.push('ใช้อินซูลิน ควรดื่มน้ำเพียงพอเพื่อป้องกันการขาดน้ำ');
    }
    
    recommendations.push('หลีกเลี่ยงเครื่องดื่มที่มีน้ำตาลสูง');
    recommendations.push('ดื่มน้ำเปล่าเป็นหลัก หลีกเลี่ยงน้ำผลไม้');
    recommendations.push('ตรวจน้ำตาลในเลือดสม่ำเสมอ');
    
    return recommendations;
  };

  const calculateFluidLimit = () => {
    let fluidLimit = 0;
    let recommendations: string[] = [];
    
    if (calculationType === 'ckd') {
      fluidLimit = calculateCKDFluidLimit();
      recommendations = getCKDRecommendations(fluidLimit);
    } else {
      fluidLimit = calculateDiabetesFluidLimit();
      recommendations = getDiabetesRecommendations(fluidLimit);
    }
    
    // กำหนดระดับความเสี่ยง
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    
    if (calculationType === 'ckd') {
      if (patientData.ckdStage >= 4 || patientData.heartFailure || fluidLimit < 1000) {
        riskLevel = 'high';
      } else if (patientData.ckdStage === 3 || patientData.edema || patientData.hypertension) {
        riskLevel = 'moderate';
      }
    } else {
      if (patientData.hba1c > 10 || patientData.diabeticComplications.nephropathy || 
          patientData.diabeticComplications.cardiovascular) {
        riskLevel = 'high';
      } else if (patientData.hba1c > 8.5 || patientData.bloodPressure.systolic > 150) {
        riskLevel = 'moderate';
      }
    }
    
    setResult({
      dailyFluidLimit: Math.round(fluidLimit),
      recommendations,
      riskLevel
    });
  };

  useEffect(() => {
    calculateFluidLimit();
  }, [patientData, calculationType]);

  const updatePatientData = (field: keyof PatientData, value: any) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  type NestedKeys = "bloodPressure" | "diabeticComplications" | "medications";
  const updateNestedData = <
  P extends NestedKeys,
  K extends keyof PatientData[P]
>(
  parent: P,
  field: K,
  value: PatientData[P][K]
) => {
  setPatientData(prev => ({
    ...prev,
    [parent]: {
      ...prev[parent], // ✅ ตอนนี้ TypeScript มั่นใจว่าเป็น object
      [field]: value
    }
  }));
};

  const resetData = () => {
    setPatientData({ ...defaultPatientData });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'red';
      case 'moderate': return 'yellow';
      default: return 'green';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'high': return 'ความเสี่ยงสูง';
      case 'moderate': return 'ความเสี่ยงปานกลาง';
      default: return 'ความเสี่ยงต่ำ';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-700"></div>
        </div>
        
        <div className="relative px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Droplets className="w-8 h-8 mr-3 text-blue-200" />
              <Calculator className="w-8 h-8 mr-3 text-indigo-200" />
              <h1 className="font-bold text-4xl md:text-5xl text-center">
                เครื่องคำนวณปริมาณน้ำสำหรับผู้ป่วย
              </h1>
            </div>
            <p className="text-blue-100 text-lg text-center max-w-3xl mx-auto">
              โรคไตเรื้อรัง และ โรคเบาหวาน - เครื่องมือช่วยวางแผนการดื่มน้ำตามภาวะสุขภาพ
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-sm text-blue-200">สำหรับผู้ป่วยไต</div>
                  <div className="text-xl font-bold">30 ml/kg</div>
                </div>
                <div className="w-px h-8 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-sm text-blue-200">สำหรับผู้ป่วยเบาหวาน</div>
                  <div className="text-xl font-bold">35 ml/kg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Calculation Type Selector */}
        <div className="flex justify-center">
          <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-200">
            <button
              onClick={() => setCalculationType('ckd')}
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
                calculationType === 'ckd'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5" />
                <span className="text-lg">ผู้ป่วยโรคไตเรื้อรัง</span>
              </div>
            </button>
            <button
              onClick={() => setCalculationType('diabetes')}
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
                calculationType === 'diabetes'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5" />
                <span className="text-lg">ผู้ป่วยโรคเบาหวาน</span>
              </div>
            </button>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <button
            onClick={resetData}
            className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 
                     hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-2xl 
                     transition-all duration-300 font-medium border border-gray-300 
                     hover:border-gray-400 hover:shadow-md transform hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            ล้างข้อมูลทั้งหมด
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Basic Patient Data */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 
                              rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">ข้อมูลทั่วไป</h2>
                  <p className="text-gray-600 text-sm">ข้อมูลพื้นฐานของผู้ป่วย</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    น้ำหนัก (กก.)
                  </label>
                  <input
                    type="number"
                    value={patientData.weight}
                    onChange={(e) => updatePatientData('weight', e.target.value ? parseFloat(e.target.value) : 0)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all bg-white text-lg"
                    min="20"
                    max="200"
                    placeholder="เช่น 70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    อายุ (ปี)
                  </label>
                  <input
                    type="number"
                    value={patientData.age}
                    onChange={(e) => updatePatientData('age', e.target.value ? parseInt(e.target.value) : 0)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all bg-white text-lg"
                    min="1"
                    max="120"
                    placeholder="เช่น 45"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  เพศ
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer bg-gray-50 hover:bg-gray-100 px-6 py-3 rounded-xl transition-all">
                    <input
                      type="radio"
                      checked={patientData.gender === 'male'}
                      onChange={() => updatePatientData('gender', 'male')}
                      className="text-blue-600 w-4 h-4"
                    />
                    <span className="ml-3 font-medium">ชาย</span>
                  </label>
                  <label className="flex items-center cursor-pointer bg-gray-50 hover:bg-gray-100 px-6 py-3 rounded-xl transition-all">
                    <input
                      type="radio"
                      checked={patientData.gender === 'female'}
                      onChange={() => updatePatientData('gender', 'female')}
                      className="text-blue-600 w-4 h-4"
                    />
                    <span className="ml-3 font-medium">หญิง</span>
                  </label>
                </div>
              </div>
            </div>

            {/* CKD Specific Inputs */}
            {calculationType === 'ckd' && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-8 border border-blue-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 
                                rounded-2xl flex items-center justify-center shadow-lg">
                    <Droplets className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-blue-800">ข้อมูลโรคไตเรื้อรัง</h2>
                    <p className="text-blue-600 text-sm">ระดับและภาวะแทรกซ้อน</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ระยะของโรคไตเรื้อรัง (CKD Stage)
                    </label>
                    <select
                      value={patientData.ckdStage || ''} 
                      onChange={(e) => updatePatientData('ckdStage', e.target.value ? parseInt(e.target.value) : 0)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all bg-white text-lg"
                    >
                      <option value="">เลือกระยะของโรค</option>
                      <option value={1}>Stage 1 (GFR ≥ 90)</option>
                      <option value={2}>Stage 2 (GFR 60-89)</option>
                      <option value={3}>Stage 3 (GFR 30-59)</option>
                      <option value={4}>Stage 4 (GFR 15-29)</option>
                      <option value={5}>Stage 5 (GFR &lt; 15)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ปริมาณปัสสาวะ 24 ชม. (มล.)
                    </label>
                    <input
                      type="number"
                      value={patientData.urineOutput}
                      onChange={(e) => updatePatientData('urineOutput', e.target.value ? parseFloat(e.target.value) : 0)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all bg-white text-lg"
                      min="0"
                      max="5000"
                      placeholder="เช่น 1500"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-4">ภาวะแทรกซ้อน</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer bg-white hover:bg-blue-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.edema}
                          onChange={(e) => updatePatientData('edema', e.target.checked)}
                          className="text-blue-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">บวมน้ำ (Edema)</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-blue-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.hypertension}
                          onChange={(e) => updatePatientData('hypertension', e.target.checked)}
                          className="text-blue-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">ความดันโลหิตสูง</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-blue-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.heartFailure}
                          onChange={(e) => updatePatientData('heartFailure', e.target.checked)}
                          className="text-blue-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">หัวใจล้มเหลว</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Diabetes Specific Inputs */}
            {calculationType === 'diabetes' && (
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl shadow-xl p-8 border border-red-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 
                                rounded-2xl flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-red-800">ข้อมูลโรคเบาหวาน</h2>
                    <p className="text-red-600 text-sm">ประเภทและภาวะแทรกซ้อน</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        ประเภทเบาหวาน
                      </label>
                      <select
                        value={patientData.diabetesType || ''}
                        onChange={(e) => updatePatientData('diabetesType', e.target.value ? parseInt(e.target.value) : 0)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-white text-lg"
                      >
                        <option value="">เลือกประเภท</option>
                        <option value="1">Type 1</option>
                        <option value="2">Type 2</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        HbA1c (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={patientData.hba1c}
                        onChange={(e) => updatePatientData('hba1c', e.target.value ? parseFloat(e.target.value) : 0)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-white text-lg"
                        min="4"
                        max="15"
                        placeholder="เช่น 7.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        ความดันโลหิต Systolic
                      </label>
                      <input
                        type="number"
                        value={patientData.bloodPressure.systolic}
                        onChange={(e) => updateNestedData('bloodPressure', 'systolic', e.target.value ? parseInt(e.target.value) : 0)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-white text-lg"
                        min="80"
                        max="250"
                        placeholder="เช่น 130"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        ความดันโลหิต Diastolic
                      </label>
                      <input
                        type="number"
                        value={patientData.bloodPressure.diastolic}
                        onChange={(e) => updateNestedData('bloodPressure', 'diastolic', e.target.value ? parseInt(e.target.value) : 0)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-white text-lg"
                        min="50"
                        max="150"
                        placeholder="เช่น 80"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-4">ภาวะแทรกซ้อนจากเบาหวาน</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.diabeticComplications.nephropathy}
                          onChange={(e) => updateNestedData('diabeticComplications', 'nephropathy', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">ไตเสื่อม</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.diabeticComplications.retinopathy}
                          onChange={(e) => updateNestedData('diabeticComplications', 'retinopathy', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">จอประสาทตาเสื่อม</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.diabeticComplications.neuropathy}
                          onChange={(e) => updateNestedData('diabeticComplications', 'neuropathy', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">เส้นประสาทเสื่อม</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.diabeticComplications.cardiovascular}
                          onChange={(e) => updateNestedData('diabeticComplications', 'cardiovascular', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">โรคหัวใจและหลอดเลือด</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-4">การใช้ยา</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.medications.diuretics}
                          onChange={(e) => updateNestedData('medications', 'diuretics', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">ยาขับปัสสาวะ (Diuretics)</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.medications.acei}
                          onChange={(e) => updateNestedData('medications', 'acei', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">ยาลดความดัน ACE Inhibitor</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.medications.insulin}
                          onChange={(e) => updateNestedData('medications', 'insulin', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">อินซูลิน</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      calculationType === 'ckd' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-br from-red-500 to-red-600'
                    }`}>
                      <Calculator className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">ผลการคำนวณ</h2>
                      <p className="text-gray-600">ปริมาณน้ำที่แนะนำต่อวัน</p>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className={`text-6xl font-bold mb-3 ${
                      calculationType === 'ckd' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {result.dailyFluidLimit.toLocaleString()}
                    </div>
                    <div className="text-xl text-gray-600 mb-2">มิลลิลิตรต่อวัน</div>
                    <div className="text-lg text-gray-500">
                      ({(result.dailyFluidLimit / 1000).toFixed(1)} ลิตรต่อวัน)
                    </div>
                  </div>

                  <div className="mb-6">
                    <Progress 
                      value={result.dailyFluidLimit} 
                      max={calculationType === 'ckd' ? 2000 : 2500} 
                      label="เปรียบเทียบกับค่ามาตรฐาน" 
                    />
                  </div>

                  <div className="text-center">
                    <Badge tone={getRiskColor(result.riskLevel) as any}>
                      <div className="flex items-center gap-2">
                        {result.riskLevel === 'low' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span className="font-medium">{getRiskText(result.riskLevel)}</span>
                      </div>
                    </Badge>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-3xl shadow-xl p-8 border border-yellow-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 
                                  rounded-2xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-yellow-800">คำแนะนำสำหรับการดูแล</h3>
                      <p className="text-yellow-600 text-sm">แนวทางในการปฏิบัติตัว</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-yellow-200">
                        <span className="text-yellow-600 mt-1 text-lg">•</span>
                        <span className="text-gray-700 leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`rounded-3xl shadow-xl p-8 border ${
                  calculationType === 'ckd' 
                    ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' 
                    : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
                }`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                      calculationType === 'ckd' 
                        ? 'bg-gradient-to-br from-red-500 to-red-600' 
                        : 'bg-gradient-to-br from-orange-500 to-red-500'
                    }`}>
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold ${
                        calculationType === 'ckd' ? 'text-red-800' : 'text-orange-800'
                      }`}>คำเตือนสำคัญ</h3>
                    </div>
                  </div>
                  <div className={`p-6 bg-white rounded-2xl border ${
                    calculationType === 'ckd' ? 'border-red-200' : 'border-orange-200'
                  }`}>
                    <p className={`text-sm leading-relaxed ${
                      calculationType === 'ckd' ? 'text-red-700' : 'text-orange-700'
                    }`}>
                      การคำนวณนี้เป็นเพียงแนวทางเบื้องต้น ควรปรึกษาแพทย์เฉพาะทาง
                      {calculationType === 'ckd' 
                        ? 'ไตหรือโภชนากร' 
                        : 'เบาหวานหรือโภชนากร'
                      }
                      เพื่อการวางแผนการรักษาที่เหมาะสมกับสภาวะของผู้ป่วยแต่ละราย
                    </p>
                  </div>
                </div>

                {/* References Section */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-3xl shadow-xl p-8 border border-gray-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 
                                  rounded-2xl flex items-center justify-center shadow-lg">
                      <Info className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">แหล่งอ้างอิงทางวิชาการ</h3>
                      <p className="text-gray-600 text-sm">เอกสารและแนวทางการรักษา</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-sm text-gray-600">
                    {calculationType === 'ckd' ? (
                      <div className="grid gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-2">แนวทางการรักษา:</h4>
                          <p>• KDOQI Clinical Practice Guideline for Nutrition in CKD: 2020 Update</p>
                          <p>• National Kidney Foundation Fluid Management Guidelines</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-2">สูตรการคำนวณ:</h4>
                          <p>• ปัสสาวะ 24 ชม. + 500-750 ml × Stage multiplier × Complications factor</p>
                          <p>• Stage multipliers: Stage 1-2 (1.0), Stage 3 (0.9), Stage 4 (0.8), Stage 5 (0.7)</p>
                          <p>• Complications: Edema (×0.8), Hypertension (×0.9), Heart failure (×0.7)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-2">แนวทางการรักษา:</h4>
                          <p>• American Diabetes Association Standards of Medical Care</p>
                          <p>• Diabetes Fluid Management Guidelines</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-2">สูตรการคำนวณ:</h4>
                          <p>• น้ำหนัก × 35 ml/kg × Age factor × HbA1c factor × BP factor</p>
                          <p>• Age factors: &gt;65 years (×0.9), &gt;75 years (×0.85)</p>
                          <p>• HbA1c factors: &gt;9% (×1.1), &gt;11% (×1.2)</p>
                          <p>• BP factors: &gt;140/90 (×0.9), &gt;160/100 (×0.85)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                    <p className="text-xs text-blue-700 leading-relaxed">
                      <strong>หมายเหตุ:</strong> สูตรการคำนวณนี้พัฒนาขึ้นจากแนวทางการรักษาทางการแพทย์สากล 
                      และปรับให้เหมาะสมกับบริบทของผู้ป่วยไทย ควรใช้ร่วมกับการประเมินทางคลินิกจากแพทย์
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluidCalculator;