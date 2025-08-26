import React, { useState, useEffect } from 'react';
import { Calculator, Droplets, User, AlertCircle, Info, Heart, Activity, RefreshCw } from 'lucide-react';

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
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Droplets className="w-8 h-8 text-blue-600" />
              <Calculator className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              เครื่องคำนวณปริมาณน้ำสำหรับผู้ป่วย
            </h1>
            <p className="text-gray-600">โรคไตเรื้อรัง และ โรคเบาหวาน</p>
          </div>

          {/* Calculation Type Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setCalculationType('ckd')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  calculationType === 'ckd'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  ผู้ป่วยโรคไตเรื้อรัง
                </div>
              </button>
              <button
                onClick={() => setCalculationType('diabetes')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  calculationType === 'diabetes'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  ผู้ป่วยโรคเบาหวาน
                </div>
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={resetData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium border border-gray-300 hover:border-gray-400"
            >
              <RefreshCw className="w-4 h-4" />
              ล้างข้อมูลทั้งหมด
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Basic Patient Data */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  ข้อมูลทั่วไป
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      น้ำหนัก (กก.)
                    </label>
                    <input
                      type="number"
                      value={patientData.weight}
                      onChange={(e) => updatePatientData('weight', e.target.value ? parseFloat(e.target.value) : 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="20"
                      max="200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      อายุ (ปี)
                    </label>
                    <input
                      type="number"
                      value={patientData.age}
                      onChange={(e) => updatePatientData('age', e.target.value ? parseInt(e.target.value) : 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="120"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เพศ
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={patientData.gender === 'male'}
                        onChange={() => updatePatientData('gender', 'male')}
                        className="text-blue-600"
                      />
                      <span className="ml-2">ชาย</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={patientData.gender === 'female'}
                        onChange={() => updatePatientData('gender', 'female')}
                        className="text-blue-600"
                      />
                      <span className="ml-2">หญิง</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* CKD Specific Inputs */}
              {calculationType === 'ckd' && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    ข้อมูลโรคไตเรื้อรัง
                  </h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ระยะของโรคไตเรื้อรัง (CKD Stage)
                    </label>
                    <select
                      value={patientData.ckdStage || ''} onChange={(e) => updatePatientData('ckdStage', e.target.value ? parseInt(e.target.value) : 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">เลือกระยะของโรค</option>
                      <option value={1}>Stage 1 (GFR ≥ 90)</option>
                      <option value={2}>Stage 2 (GFR 60-89)</option>
                      <option value={3}>Stage 3 (GFR 30-59)</option>
                      <option value={4}>Stage 4 (GFR 15-29)</option>
                      <option value={5}>Stage 5 (GFR &lt; 15)</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ปริมาณปัสสาวะ 24 ชม. (มล.)
                    </label>
                    <input
                      type="number"
                      value={patientData.urineOutput}
                      onChange={(e) => updatePatientData('urineOutput', e.target.value ? parseFloat(e.target.value) : 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="5000"
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">ภาวะแทรกซ้อน</h3>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={patientData.edema}
                        onChange={(e) => updatePatientData('edema', e.target.checked)}
                        className="text-blue-600"
                      />
                      <span className="ml-2">บวมน้ำ (Edema)</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={patientData.hypertension}
                        onChange={(e) => updatePatientData('hypertension', e.target.checked)}
                        className="text-blue-600"
                      />
                      <span className="ml-2">ความดันโลหิตสูง</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={patientData.heartFailure}
                        onChange={(e) => updatePatientData('heartFailure', e.target.checked)}
                        className="text-blue-600"
                      />
                      <span className="ml-2">หัวใจล้มเหลว</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Diabetes Specific Inputs */}
              {calculationType === 'diabetes' && (
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h2 className="text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    ข้อมูลโรคเบาหวาน
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ประเภทเบาหวาน
                      </label>
                      <select
                        value={patientData.diabetesType || ''}
                        onChange={(e) => updatePatientData('diabetesType', e.target.value ? parseInt(e.target.value) : 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">เลือกประเภทของโรค</option>
                        <option value="1">Type 1</option>
                        <option value="2">Type 2</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        HbA1c (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={patientData.hba1c}
                        onChange={(e) => updatePatientData('hba1c', e.target.value ? parseFloat(e.target.value) : 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="4"
                        max="15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ความดันโลหิต Systolic
                      </label>
                      <input
                        type="number"
                        value={patientData.bloodPressure.systolic}
                        onChange={(e) => updateNestedData('bloodPressure', 'systolic', e.target.value ? parseInt(e.target.value) : 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="80"
                        max="250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ความดันโลหิต Diastolic
                      </label>
                      <input
                        type="number"
                        value={patientData.bloodPressure.diastolic}
                        onChange={(e) => updateNestedData('bloodPressure', 'diastolic', e.target.value ? parseInt(e.target.value) : 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="50"
                        max="150"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <h3 className="font-medium text-gray-700">ภาวะแทรกซ้อนจากเบาหวาน</h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={patientData.diabeticComplications.nephropathy}
                          onChange={(e) => updateNestedData('diabeticComplications', 'nephropathy', e.target.checked)}
                          className="text-red-600"
                        />
                        <span className="ml-2">ไตเสื่อม</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={patientData.diabeticComplications.retinopathy}
                          onChange={(e) => updateNestedData('diabeticComplications', 'retinopathy', e.target.checked)}
                          className="text-red-600"
                        />
                        <span className="ml-2">จอประสาทตาเสื่อม</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={patientData.diabeticComplications.neuropathy}
                          onChange={(e) => updateNestedData('diabeticComplications', 'neuropathy', e.target.checked)}
                          className="text-red-600"
                        />
                        <span className="ml-2">เส้นประสาทเสื่อม</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={patientData.diabeticComplications.cardiovascular}
                          onChange={(e) => updateNestedData('diabeticComplications', 'cardiovascular', e.target.checked)}
                          className="text-red-600"
                        />
                        <span className="ml-2">โรคหัวใจและหลอดเลือด</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">การใช้ยา</h3>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={patientData.medications.diuretics}
                          onChange={(e) => updateNestedData('medications', 'diuretics', e.target.checked)}
                          className="text-red-600"
                        />
                        <span className="ml-2">ยาขับปัสสาวะ (Diuretics)</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={patientData.medications.acei}
                          onChange={(e) => updateNestedData('medications', 'acei', e.target.checked)}
                          className="text-red-600"
                        />
                        <span className="ml-2">ยาลดความดัน ACE Inhibitor</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={patientData.medications.insulin}
                          onChange={(e) => updateNestedData('medications', 'insulin', e.target.checked)}
                          className="text-red-600"
                        />
                        <span className="ml-2">อินซูลิน</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result && (
                <>
                  <div className={`rounded-xl p-6 border ${
                    calculationType === 'ckd' 
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
                      : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200'
                  }`}>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">ผลการคำนวณ</h2>
                    
                    <div className="text-center mb-4">
                      <div className={`text-4xl font-bold mb-2 ${
                        calculationType === 'ckd' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {result.dailyFluidLimit.toLocaleString()}
                      </div>
                      <div className="text-lg text-gray-600">มิลลิลิตรต่อวัน</div>
                      <div className="text-sm text-gray-500 mt-1">
                        ({(result.dailyFluidLimit / 1000).toFixed(1)} ลิตรต่อวัน)
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border ${getRiskColor(result.riskLevel)} text-center`}>
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">{getRiskText(result.riskLevel)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-yellow-600" />
                      คำแนะนำ
                    </h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-yellow-600 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`rounded-xl p-6 border ${
                    calculationType === 'ckd' 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-orange-50 border-orange-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      calculationType === 'ckd' ? 'text-red-800' : 'text-orange-800'
                    }`}>คำเตือน</h3>
                    <p className={`text-sm ${
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

                  {/* References Section */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-gray-600" />
                      แหล่งอ้างอิง
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      {calculationType === 'ckd' ? (
                        <>
                          <p>• KDOQI Clinical Practice Guideline for Nutrition in CKD: 2020 Update</p>
                          <p>• National Kidney Foundation Fluid Management Guidelines</p>
                          <p>• สูตรคำนวณ: ปัสสาวะ 24 ชม. + 500-750 ml × Stage multiplier × Complications factor</p>
                          <p>• Stage multipliers: Stage 1-2 (1.0), Stage 3 (0.9), Stage 4 (0.8), Stage 5 (0.7)</p>
                          <p>• Complications: Edema (×0.8), Hypertension (×0.9), Heart failure (×0.7)</p>
                        </>
                      ) : (
                        <>
                          <p>• American Diabetes Association Standards of Medical Care</p>
                          <p>• Diabetes Fluid Management Guidelines</p>
                          <p>• สูตรคำนวณ: น้ำหนัก × 35 ml/kg × Age factor × HbA1c factor × BP factor</p>
                          <p>• Age factors: &gt;65 years (×0.9), &gt;75 years (×0.85)</p>
                          <p>• HbA1c factors: &gt;9% (×1.1), &gt;11% (×1.2)</p>
                          <p>• BP factors: &gt;140/90 (×0.9), &gt;160/100 (×0.85)</p>
                        </>
                      )}
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700">
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
    </div>
  );
};

export default FluidCalculator;