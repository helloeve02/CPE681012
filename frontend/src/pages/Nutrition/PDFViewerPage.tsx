import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import NutritionPDF from './NutritionPDF';
import { useLocation } from 'react-router-dom';

const PDFViewerPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dataString = searchParams.get("data");

  const parsedData = dataString ? JSON.parse(decodeURIComponent(dataString)) : {
    nutritionDatas: [],
    portionDatas: [],
    caloryDatas: 0,
  };
  return (
    <div className="fixed left-0 w-screen h-screen z-[9999] bg-white">
      <PDFViewer width="100%" height="100%">
        <NutritionPDF {...parsedData} />
      </PDFViewer>
    </div>
  );
};

export default PDFViewerPage;
