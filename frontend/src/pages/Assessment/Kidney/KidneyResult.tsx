// pages/assessment/kidney/KidneyRiskResultPage.tsx
import { useLocation } from "react-router-dom";

export default function KidneyRiskResultPage() {
  const { state } = useLocation();

  const getRiskLevel = (score: number) => {
    if (score >= 8) return "เสี่ยงสูงมาก";
    if (score >= 4) return "เสี่ยงปานกลาง";
    return "เสี่ยงต่ำ";
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-6">ผลการประเมิน</h1>
      <p className="text-lg mb-4">คะแนนรวม: <strong>{state.totalScore}</strong></p>
      <p className="text-lg">ระดับความเสี่ยง: <strong>{getRiskLevel(state.totalScore)}</strong></p>
    </div>
  );
}
