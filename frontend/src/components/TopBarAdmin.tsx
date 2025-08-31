import { useNavigate } from "react-router-dom";

export const TopBarAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("role");
    navigate("/admin");
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-10 font-kanit">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="text-gray-600 text-sm">ยินดีต้อนรับ</span>
        <div className="flex items-center space-x-4">
          <span className="text-gray-800 font-medium text-lg">Admin</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
