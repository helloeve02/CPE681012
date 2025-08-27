import React from "react";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import { FilePdfOutlined } from "@ant-design/icons";
import { fetchNutritionPdfData } from "../pages/Nutrition/PDFViewerPage";
import NutritionPDF from "../pages/Nutrition/NutritionPDF";

type PDFDownloadButtonProps = {
  className?: string;
};

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 640;

    if (!isMobile) {
      navigate("/pdf-viewer");
      return;
    }

    try {
      const data = await fetchNutritionPdfData();
      const blob = await pdf(<NutritionPDF {...data} />).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "nutrition-report.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF.");
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center ml-5 text-xl cursor-pointer !text-gray-800 hover:!text-blue-600 transition-colors transform hover:scale-110 ${className}`}
    >
      <FilePdfOutlined />
      PDF
    </div>
  );
};

export default PDFDownloadButton;
