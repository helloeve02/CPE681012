import React, { useState, useEffect } from 'react';
import { Calculator, Droplets, User, AlertCircle, Info } from 'lucide-react';

interface PatientData {
  weight: number;
  age: number;
  gender: 'male' | 'female';
  ckdStage: number;
  urineOutput: number;
  edema: boolean;
  hypertension: boolean;
  heartFailure: boolean;
}

const MaintenanceFluid: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    weight: 70,
    age: 50,
    gender: 'male',
    ckdStage: 3,
    urineOutput: 1500,
    edema: false,
    hypertension: false,
    heartFailure: false
  });

  const [result, setResult] = useState<{
    dailyFluidLimit: number;
    recommendations: string[];
    riskLevel: 'low' | 'moderate' | 'high';
  } | null>(null);

  const calculateFluidLimit = () => {
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
    
    // ใช้ค่าที่น้อยกว่า
    baseFluid = Math.min(baseFluid, weightBasedFluid);
    
    // ปรับตามภาวะแทรกซ้อน
    if (patientData.edema) baseFluid *= 0.8;
    if (patientData.hypertension) baseFluid *= 0.9;
    if (patientData.heartFailure) baseFluid *= 0.7;
    
    // สร้างคำแนะนำ
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
    
    if (baseFluid < 1000) {
      recommendations.push('ปริมาณน้ำน้อยมาก ควรปรึกษาแพทย์');
    }
    
    recommendations.push('หลีกเลี่ยงผลไม้ที่มีโปแตสเซียมสูง');
    recommendations.push('แบ่งดื่มน้ำตลอดวัน ไม่ดื่มครั้งเดียวมาก');
    
    // กำหนดระดับความเสี่ยง
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    
    if (patientData.ckdStage >= 4 || patientData.heartFailure || baseFluid < 1000) {
      riskLevel = 'high';
    } else if (patientData.ckdStage === 3 || patientData.edema || patientData.hypertension) {
      riskLevel = 'moderate';
    }
    
    setResult({
      dailyFluidLimit: Math.round(baseFluid),
      recommendations,
      riskLevel
    });
  };

  useEffect(() => {
    calculateFluidLimit();
  }, [patientData]);

  const updatePatientData = (field: keyof PatientData, value: any) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Droplets className="w-8 h-8 text-blue-600" />
              <Calculator className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              เครื่องคำนวณปริมาณจำกัดน้ำ
            </h1>
            <p className="text-gray-600">สำหรับผู้ป่วยโรคไตเรื้อรัง</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  ข้อมูลผู้ป่วย
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      น้ำหนัก (กก.)
                    </label>
                    <input
                      type="number"
                      value={patientData.weight}
                      onChange={(e) => updatePatientData('weight', parseFloat(e.target.value) || 0)}
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
                      onChange={(e) => updatePatientData('age', parseInt(e.target.value) || 0)}
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

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ระยะของโรคไตเรื้อรัง (CKD Stage)
                  </label>
                  <select
                    value={patientData.ckdStage}
                    onChange={(e) => updatePatientData('ckdStage', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
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
                    onChange={(e) => updatePatientData('urineOutput', parseFloat(e.target.value) || 0)}
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
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result && (
                <>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">ผลการคำนวณ</h2>
                    
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
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

                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">คำเตือน</h3>
                    <p className="text-red-700 text-sm">
                      การคำนวณนี้เป็นเพียงแนวทางเบื้องต้น ควรปรึกษาแพทยฺ์เฉพาะทางไตหรือโภชนากรเพื่อการวางแผนการรักษาที่เหมาะสมกับสภาวะของผู้ป่วยแต่ละราย
                    </p>
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

export default MaintenanceFluid;