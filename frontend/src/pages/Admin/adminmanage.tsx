import React, { useEffect, useState } from "react";
import { TopBarAdmin } from "../../components/TopBarAdmin";
// import type { FoodItemInterface } from "../../interfaces/FoodItem";
import { ListUsers, CreateUser, DeleteUserByID } from "../../services/https";
import type { AdminInterface } from "../../interfaces/Admin";

const FoodAdminPanel: React.FC = () => {
  const [foodItems, setFoodItems] = useState<AdminInterface[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminInterface | null>(null);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Password: "",
    UserName: ""
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [message, setMessage] = useState({ type: "", text: "", show: false });

  // Message handler
  const showMessage = (type: "success" | "error" | "info", text: string) => {
    setMessage({ type, text, show: true });
    setTimeout(() => {
      setMessage({ type: "", text: "", show: false });
    }, 3000);
  };

  const fetchFoodItems = async () => {
    try {
      const res = await ListUsers();
      if (res?.data) {
        setFoodItems(res.data);
      }
    } catch (err) {
      showMessage("error", "โหลดข้อมูลล้มเหลว");
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.FirstName || !formData.LastName || !formData.UserName || !formData.Password) {
      showMessage("error", "กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      if (editingItem) {
        // update mode (mock)
        setFoodItems((prev) =>
          prev.map((f) => (f.ID === editingItem.ID ? { ...formData, ID: editingItem.ID } : f))
        );
        showMessage("success", "แก้ไขสำเร็จ");
        setTimeout(() => {
          window.location.reload();
        }, 1000); // 1 วินาที
      } else {
        // create mode
        const res = await CreateUser(formData);
        if (res?.status === 201) {
          setFoodItems((prev) => [...prev, res.data]);
          showMessage("success", "เพิ่มข้อมูลสำเร็จ");
          setTimeout(() => {
            window.location.reload();
          }, 1000); // 1 วินาที
        }
      }
      setShowAddForm(false);
      setFormData({ FirstName: "", LastName: "", Password: "", UserName: "" });
      setEditingItem(null);
    } catch (err) {
      showMessage("error", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await DeleteUserByID(deleteId);
      if (res) {
        setFoodItems((prev) => prev.filter((f) => f.ID !== deleteId));
        showMessage("success", "ลบสำเร็จ");
      }
    } catch {
      showMessage("error", "ไม่สามารถลบได้");
    }

    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const openAddForm = () => {
    setEditingItem(null);
    setFormData({ FirstName: "", LastName: "", Password: "", UserName: "" });
    setShowAddForm(true);
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('admin-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const openEditForm = (item: AdminInterface) => {
    setEditingItem(item);
    setFormData({
      FirstName: item.FirstName || "",
      LastName: item.LastName || "",
      UserName: item.UserName || "",
      Password: ""
    });
    setShowAddForm(true);
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('admin-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({ FirstName: "", LastName: "", Password: "", UserName: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-kanit">
      <TopBarAdmin />

      {/* Message Toast */}
      {message.show && (
        <div className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border transform transition-all duration-500 ease-out ${message.type === 'success' ? 'bg-emerald-500/95 text-white border-emerald-400/50 shadow-emerald-500/25' :
          message.type === 'error' ? 'bg-red-500/95 text-white border-red-400/50 shadow-red-500/25' :
            'bg-blue-500/95 text-white border-blue-400/50 shadow-blue-500/25'
          }`}>
          <div className="flex items-center space-x-3">
            {message.type === 'success' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {message.type === 'error' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 font-kanit">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">คุณแน่ใจหรือไม่ที่จะลบรายการนี้?<br />การกระทำนี้ไม่สามารถยกเลิกได้</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl transition-all duration-200 font-semibold border-2 border-transparent hover:border-gray-300"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  ลบทันที
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-3xl opacity-20 rounded-full"></div>
            <div className="relative">
              <div className="inline-flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                ระบบจัดการแอดมิน
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                จัดการข้อมูลผู้ดูแลระบบอย่างมีประสิทธิภาพและปลอดภัย
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white p-8 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden max-w-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">จำนวนแอดมินทั้งหมด</p>
              <div className="text-4xl font-black text-white mt-2 mb-4">{foodItems.length}</div>
              <div className="text-blue-100 text-sm">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  ผู้ใช้ที่ลงทะเบียน
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!showAddForm && (
          <div className="text-center">
            <button
              onClick={openAddForm}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>เพิ่มแอดมินใหม่</span>
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div id="admin-form" className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-bold">
                      {editingItem ? "แก้ไขข้อมูลแอดมิน" : "เพิ่มแอดมินใหม่"}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">
                      {editingItem ? "อัปเดตข้อมูลผู้ดูแลระบบ" : "สร้างผู้ดูแลระบบใหม่"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={cancelForm}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-3 rounded-xl transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block font-bold text-gray-700 text-lg mb-3">ชื่อ</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="FirstName"
                        value={formData.FirstName}
                        onChange={handleInputChange}
                        placeholder="กรอกชื่อจริง"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-gray-700 text-lg mb-3">นามสกุล</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="LastName"
                        value={formData.LastName}
                        onChange={handleInputChange}
                        placeholder="กรอกนามสกุล"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-gray-700 text-lg mb-3">ชื่อผู้ใช้</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-blue-400 font-bold text-lg group-focus-within:text-blue-600 transition-colors">@</span>
                      </div>
                      <input
                        type="text"
                        name="UserName"
                        value={formData.UserName}
                        onChange={handleInputChange}
                        placeholder="กรอก Username"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-gray-700 text-lg mb-3">รหัสผ่าน</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleInputChange}
                        placeholder="กรอกรหัสผ่าน"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200/50 pt-8">
                  <div className="flex justify-center space-x-6">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3 text-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{editingItem ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-10 py-4 rounded-2xl font-bold border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 text-lg"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admin List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold">รายการแอดมินในระบบ</h3>
                <p className="text-white/80 text-sm mt-1">จัดการและดูข้อมูลผู้ดูแลระบบทั้งหมด</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 min-h-96">
            {foodItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl opacity-20 rounded-full"></div>
                </div>
                <h3 className="text-3xl font-bold text-gray-600 mb-4">ยังไม่มีข้อมูลแอดมิน</h3>
                <p className="text-gray-500 text-xl mb-8 max-w-md mx-auto leading-relaxed">
                  เริ่มต้นโดยการเพิ่มแอดมินคนแรกเข้าสู่ระบบเพื่อเริ่มการจัดการ
                </p>
                <button
                  onClick={openAddForm}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>เพิ่มแอดมินคนแรก</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {foodItems.map((item) => (
                  <div
                    key={item.ID}
                    className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-white/50"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 p-6 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>

                      <div className="relative">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>

                        <div className="text-white font-semibold text-base">
                          แอดมินคนที่ {item.ID}
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      <div className="text-center space-y-3">
                        <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                          {item.FirstName} {item.LastName}
                        </h4>
                        <p className="text-blue-600 font-semibold">@{item.UserName}</p>
                        <div className="flex justify-center">
                          <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
                            ID: {item.ID}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => openEditForm(item)}
                            className="flex items-center justify-center p-2 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-amber-200"
                            title="แก้ไข"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(item.ID!)}
                            className="flex items-center justify-center p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-red-200"
                            title="ลบ"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodAdminPanel;