import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Menu from "./pages/Menu/menu";
import NavBar from "./components/NavBar";
import MenuDetail from "./pages/Menu/menudetails";
import NewsCategoryPage from "./pages/KnowledgeNews/NewsCategoryPage";
// import MediaNewsPage from "./pages/KnowledgeNews/Multimedia";
import HealthAssessmentPage from "./pages/Assessment/AssessmentCategoryPage";
import BMICalculator from "./pages/Assessment/BMI/BMI";
import GeneralHealthIntroPage from "./pages/Assessment/BMI/InformationBMI";
import BMICalculatorResultPage from "./pages/Assessment/BMI/BMICalculatorResultPage";
import SelectAgeRange from "./pages/Assessment/Diabetes/SelectAge";
import DiabetesMoreAssessmentPage from "./pages/Assessment/Diabetes/More";
import DiabetesLessAssessmentPage from "./pages/Assessment/Diabetes/Less";
import KidneyriskAssessmentPage from "./pages/Assessment/Kidney/Kidney";
import MealPlannerApp from "./pages/Plan/Mealplan";
import FoodAdminPanel from "./pages/Admin/Fooditem";
import HomePage from "./pages/Home/HomePage";
import NutritionInput from "./pages/Nutrition/NutritionInput";
import NutritionSuggestion from "./pages/Nutrition/NutritionSuggestion";
import ChooseAvoid from "./pages/Nutrition/ChooseAvoid";
import PDFViewerPage from "./pages/Nutrition/PDFViewerPage";
import AdminLoginForm from "./pages/Admin/admin"
// import LoginSignupPage from "./pages/Admin/admin";
// import ForgotPasswordPage from "./pages/Admin/forgorpass"
import AdminDashboard from "./pages/Admin/homepageadmin"
import NutritionInformation from "./pages/KnowledgeNews/NutritionInformation";
import KidneyInformation from "./pages/KnowledgeNews/KidneyInformation";
import ExerciseInformation from "./pages/KnowledgeNews/ExerciseInformation";
import DiabetesInformation from "./pages/KnowledgeNews/DiabetesInformation";
import VideoDetailPage from "./pages/KnowledgeNews/VideoPage";
import VideoPage from "./pages/KnowledgeNews/VideoPage";
import MenuAdminPanel from "./pages/Admin/Menuadmin";
import EducationalAdminPanel from "./pages/Admin/Educationaladmin";
import VideoInformation from "./pages/KnowledgeNews/VideoInformation";
import InfographicInformation from "./pages/KnowledgeNews/InfographicInformation";
import ArticleInformation from "./pages/KnowledgeNews/ArticleInformation"
import SodiumCalculator from "./pages/Menu/menucal"
import PrivateRoute from "./PrivateRoute";
import SodiumBubbleChart from "./pages/Menu/menusodiu";
import FluidCalculator from "./pages/Plan/FluidCalculator";
import PasswordResetForm from "./pages/Admin/forgorpass";
import InfographicDetailPage from "./pages/KnowledgeNews/InfographicPage";
import ArticleDetailPage from "./pages/KnowledgeNews/ArticlePage";
import CleaningMethodCards from "./pages/Menu/menucleaningre"
import ImportanceOfNutrition from "./pages/Nutrition/ImportanceOfNutrition";
import MenuTaste from "./pages/Menu/menutaste"
import AdminManage from "./pages/Admin/adminmanage"
import FoodExchanges from "./pages/Nutrition/FoodExchanges";
import DiabetesResultPage from "./pages/Assessment/Diabetes/DiabetesResultPage ";
import KidneyRiskResultsPage from "./pages/Assessment/Kidney/KidneyResult";
import StressAssessmentForm from "./pages/Assessment/Stress/Stress";
import StressResultsPage from "./pages/Assessment/Stress/StressResult";
import DepressionAssessmentForm from "./pages/Assessment/Depression/Depression";
import DepressionResultsPage from "./pages/Assessment/Depression/DepressionResult";
import Menulabel from "./pages/Menu/menulabel"
const AppContent = () => {
  const location = useLocation();

  // เช็คว่าไม่ใช่หน้า admin ค่อยแสดง NavBar
  const hideNavBar = ["/admin", "/pdf-viewer","/admin-home","/admin/menu","/admin/educational","/admin/fooditem", "/forgot-pass","/admin/adminmanage"].includes(location.pathname);

  return (
    <>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nutrition" element={<NutritionInput />} />
        <Route path="/nutrition-suggestion" element={<NutritionSuggestion />} />
        <Route path="/choose-avoid" element={<ChooseAvoid />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<MenuDetail />} />
        <Route path="/selectnewscategorypage" element={<NewsCategoryPage />} />
        {/* <Route path="/medianewspage" element={<MediaNewsPage />} /> */}
        <Route path="/KidneyInformation" element={<KidneyInformation />} />
        <Route path="/NutritionInformation" element={<NutritionInformation />} />
        <Route path="/DiabetesInformation" element={<DiabetesInformation />} />
        <Route path="/ExerciseInformation" element={<ExerciseInformation />} />
        <Route path="/VideoPage" element={<VideoPage />} />
        <Route path="/video/:id" element={<VideoDetailPage />} />
        <Route path="/infographic/:id" element={<InfographicDetailPage/>} />
        <Route path="/article/:id" element={<ArticleDetailPage />} />
        <Route path="/VideoInformation" element={<VideoInformation />} />
        <Route path="/InfographicInformation" element={<InfographicInformation />} />
        <Route path="/ArticleInformation" element={<ArticleInformation />} />
        <Route path="/selectassessmentcategorypage" element={<HealthAssessmentPage />} />
        <Route path="/assessment/information/bmi" element={<GeneralHealthIntroPage />} />
        <Route path="/assessment/bmi" element={<BMICalculator />} />
        <Route path="/assessment/bmiresult" element={<BMICalculatorResultPage />} />
        <Route path="/assessment/diabetes-result" element={<DiabetesResultPage />} />
        <Route path="/assessment/kidneys-result" element={<KidneyRiskResultsPage />} />
        <Route path="/assessment/stress" element={<StressAssessmentForm />} />
        <Route path="/assessment/stress-result" element={<StressResultsPage />} />
        <Route path="/assessment/depression" element={<DepressionAssessmentForm />} />
        <Route path="/assessment/depression-result" element={<DepressionResultsPage />} />
        <Route path="/assessment/selectagerange" element={<SelectAgeRange />} />
        <Route path="/assessment/diabetesmoreassessmentpage" element={<DiabetesMoreAssessmentPage />} />
        <Route path="/assessment/diabeteslessassessmentpage" element={<DiabetesLessAssessmentPage />} />
        <Route path="/assessment/kidneyriskassessmentpage" element={<KidneyriskAssessmentPage />} />
        <Route path="/mealplanner" element={<MealPlannerApp />} />
        <Route path="/pdf-viewer" element={<PDFViewerPage />} />
        <Route path="/admin" element={<AdminLoginForm />} />
        <Route path="/admin/fooditem" element={<PrivateRoute><FoodAdminPanel /></PrivateRoute>} />
        <Route path="/admin/menu" element={<PrivateRoute><MenuAdminPanel /></PrivateRoute>} />
        <Route path="/admin/educational" element={<PrivateRoute><EducationalAdminPanel /></PrivateRoute>} />
        <Route path="/forgot-pass" element={<PasswordResetForm />} />
        <Route path="/admin-home" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/menucal" element={<SodiumCalculator />} />
        <Route path="/importance-of-nutrition" element={<ImportanceOfNutrition />} />
        <Route path="/menusodium" element={<SodiumBubbleChart />} />
        <Route path="/fluidcalculator" element={<FluidCalculator />} />
        <Route path="/cleaningre" element={<CleaningMethodCards />} />
        <Route path="/menutaste" element={<MenuTaste />} />
        <Route path="/admin/adminmanage" element={<PrivateRoute><AdminManage /></PrivateRoute>} />
        <Route path="/food-exchanges" element={<FoodExchanges />} />
        <Route path="/menulabel" element={<Menulabel />} />
        
      </Routes>
    </>
  );
};

function App() {
  useEffect(() => {
    // ถ้าไม่มีค่า isLogin ให้ตั้งค่าเป็น false
    if (localStorage.getItem("isLogin") === null) {
      localStorage.setItem("isLogin", "false");
    }
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
