import React, { useEffect, useState, useRef } from "react";
import { TopBarAdmin } from "../../components/TopBarAdmin";
import { ListUsers, CreateUser, DeleteUserByID } from "../../services/https";
import type { AdminInterface } from "../../interfaces/Admin";
import { Search, Plus, Edit, Trash2, Save, X, Filter, Hash, Eye, ArrowLeft, User, UserCheck } from 'lucide-react';
import { message } from "antd";

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewingItem, setViewingItem] = useState<AdminInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await ListUsers();
      if (res?.data) {
        setFoodItems(res.data);
      }
    } catch (error: any) {
      setErr(error?.message || "โหลดข้อมูลไม่สำเร็จ");
      message.error("โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
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
      message.warning("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      if (editingItem) {
        // update mode (mock)
        setFoodItems((prev) =>
          prev.map((f) => (f.ID === editingItem.ID ? { ...formData, ID: editingItem.ID } : f))
        );
        message.success("แก้ไขสำเร็จ");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // create mode
        const res = await CreateUser(formData);
        if (res?.status === 201) {
          setFoodItems((prev) => [...prev, res.data]);
          message.success("เพิ่มข้อมูลสำเร็จ");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
      setShowAddForm(false);
      setFormData({ FirstName: "", LastName: "", Password: "", UserName: "" });
      setEditingItem(null);
    } catch (err) {
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
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
        message.success("ลบสำเร็จ");
      }
    } catch {
      message.error("ไม่สามารถลบได้");
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
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({ FirstName: "", LastName: "", Password: "", UserName: "" });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  // Filter items based on search term
  const filteredItems = foodItems.filter(item => 
    item.FirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.LastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.UserName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden font-kanit">
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-300/30 to-cyan-300/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-cyan-300/30 to-teal-300/30 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl px-12 py-8 border border-white/50">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xl font-semibold text-gray-800">กำลังโหลดข้อมูล...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State  
  if (err) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden font-kanit">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-red-300/30 to-pink-300/30 rounded-full filter blur-3xl animate-pulse"></div>
        </div>
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl px-12 py-8 border border-white/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">เกิดข้อผิดพลาด</h3>
              <p className="text-gray-600">{err}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden font-kanit">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-300/30 to-cyan-300/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-cyan-300/30 to-teal-300/30 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-300/30 to-blue-300/30 rounded-full filter blur-3xl animate-pulse delay-[2000ms]"></div>
      </div>

      {/* Floating Sparkles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60 animate-ping"></div>
          </div>
        ))}
      </div>

      {/* Navbar */}
      <div>
        <TopBarAdmin />
      </div>

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

      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-3xl opacity-20 rounded-full"></div>
            <div className="relative">
              <div className="inline-flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <UserCheck className="w-8 h-8 text-white" />
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

          <div className="flex justify-center">
            <button
              onClick={handleGoBack}
              className="bg-gradient-to-r from-slate-500 to-gray-600 text-white px-8 py-3 rounded-2xl hover:from-slate-600 hover:to-gray-700 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              ย้อนกลับ
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Filter className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold">ตัวกรองและค้นหา</h3>
                <p className="text-white/80 text-sm mt-1">ค้นหาและกรองแอดมินที่ต้องการ</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 md:col-span-2">
                <label className="block text-sm font-bold text-gray-700">ค้นหา</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อ นามสกุล หรือ username..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">&nbsp;</label>
                {!showAddForm && (
                  <button
                    onClick={openAddForm}
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Plus className="w-5 h-5" />
                    เพิ่มแอดมินใหม่
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div ref={formRef} id="admin-form" className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <UserCheck className="w-6 h-6 text-white" />
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
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block font-bold text-gray-700 text-lg">
                      ชื่อ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
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

                  <div className="space-y-3">
                    <label className="block font-bold text-gray-700 text-lg">
                      นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
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

                  <div className="space-y-3">
                    <label className="block font-bold text-gray-700 text-lg">
                      ชื่อผู้ใช้ <span className="text-red-500">*</span>
                    </label>
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

                  <div className="space-y-3">
                    <label className="block font-bold text-gray-700 text-lg">
                      รหัสผ่าน <span className="text-red-500">*</span>
                    </label>
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
                      <Save className="w-6 h-6" />
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
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold">รายการแอดมินในระบบ ({filteredItems.length} คน)</h3>
                <p className="text-white/80 text-sm mt-1">จัดการและดูข้อมูลผู้ดูแลระบบทั้งหมด</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 min-h-96">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <UserCheck className="w-16 h-16 text-blue-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl opacity-20 rounded-full"></div>
                </div>
                <h3 className="text-3xl font-bold text-gray-600 mb-4">
                  {searchTerm ? "ไม่พบข้อมูลที่ค้นหา" : "ยังไม่มีข้อมูลแอดมิน"}
                </h3>
                <p className="text-gray-500 text-xl mb-8 max-w-md mx-auto leading-relaxed">
                  {searchTerm 
                    ? "ลองปรับเปลี่ยนคำค้นหาหรือเพิ่มแอดมินใหม่" 
                    : "เริ่มต้นโดยการเพิ่มแอดมินคนแรกเข้าสู่ระบบเพื่อเริ่มการจัดการ"
                  }
                </p>
                {!showAddForm && (
                  <button
                    onClick={openAddForm}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto text-lg"
                  >
                    <Plus className="w-6 h-6" />
                    <span>เพิ่มแอดมินคนแรก</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.ID}
                    className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-white/50"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 p-6 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>

                      <div className="relative">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                          <User className="w-8 h-8 text-blue-500" />
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
                            onClick={() => setViewingItem(item)}
                            className="flex items-center justify-center p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-blue-200"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openEditForm(item)}
                            className="flex items-center justify-center p-2 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-amber-200"
                            title="แก้ไข"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.ID!)}
                            className="flex items-center justify-center p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-red-200"
                            title="ลบ"
                          >
                            <Trash2 className="w-5 h-5" />
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
      
      {/* Viewing Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-kanit">
          <div className="bg-white rounded-3xl shadow-2xl relative p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingItem(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {viewingItem.FirstName} {viewingItem.LastName}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl">
                  <h3 className="font-bold text-gray-800 mb-2">ข้อมูลผู้ใช้</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-800">ชื่อผู้ใช้:</span> @{viewingItem.UserName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-800">รหัสแอดมิน:</span> {viewingItem.ID}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-600 text-center">
                    <span className="font-medium text-gray-800">สถานะ:</span> ผู้ดูแลระบบที่ใช้งานอยู่
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodAdminPanel;