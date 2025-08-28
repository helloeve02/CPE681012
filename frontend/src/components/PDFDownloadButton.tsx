import React from "react";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import { FilePdfOutlined, DownloadOutlined } from "@ant-design/icons";
import { fetchNutritionPdfData } from "../pages/Nutrition/PDFViewerPage";
import NutritionPDF from "../pages/Nutrition/NutritionPDF";

type PDFDownloadButtonProps = {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
};

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ 
  className = "",
  variant = "outline",
  size = "large"
}) => {
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

  const sizeClasses = {
    small: "h-10 px-4 text-sm",
    medium: "h-12 px-6 text-base", 
    large: "h-16 px-8 text-xl"
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-red-500 to-pink-600
      text-white border-0 shadow-xl
      hover:from-red-600 hover:to-pink-700
      hover:shadow-2xl
    `,
    secondary: `
      bg-gradient-to-r from-gray-600 to-gray-700
      text-white border-0 shadow-xl
      hover:from-gray-700 hover:to-gray-800
      hover:shadow-2xl
    `,
    outline: `
      bg-white/80 backdrop-blur-md
      text-gray-700 border-2 border-gray-300
      shadow-lg hover:bg-white
      hover:border-red-400 hover:text-red-600
      hover:shadow-xl
    `
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        font-kanit font-semibold rounded-2xl
        transition-all duration-300 
        hover:scale-105 transform
        flex items-center justify-center gap-3
        group relative overflow-hidden
        ${className}
      `}
    >
      {/* Background animation overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      <div className="relative flex items-center gap-3">
        <div className="relative">
          <FilePdfOutlined className="transition-transform duration-300 group-hover:scale-110" />
          {/* Mobile indicator */}
          <DownloadOutlined 
            className="absolute -top-1 -right-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden" 
          />
        </div>
        <span className="font-semibold">
          <span className="hidden sm:inline">ดาวน์โหลด </span>PDF
        </span>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-2 left-4 w-1 h-1 bg-current rounded-full animate-ping" style={{ animationDelay: '0ms' }}></div>
        <div className="absolute top-4 right-6 w-1 h-1 bg-current rounded-full animate-ping" style={{ animationDelay: '200ms' }}></div>
        <div className="absolute bottom-3 left-6 w-1 h-1 bg-current rounded-full animate-ping" style={{ animationDelay: '400ms' }}></div>
      </div>
    </button>
  );
};

export default PDFDownloadButton;