import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, Plus, Edit, Trash2, Save, X, Filter, ExternalLink, BookOpen, Eye, ArrowLeft } from "lucide-react";
import {
  GetAllContent,
  GetAllCategory,
  GetAllGroupContent,
  CreateContent as CreateContentAPI,
  UpdateContent as UpdateContentAPI,
  DeleteContent as DeleteContentAPI,
} from "../../services/https";
import type { AdminInterface } from "../../interfaces/Admin";
import type { EducationalContentInterface } from "../../interfaces/EducationalContent ";
import type { ContentCategoryInterface } from "../../interfaces/ContentCategory";
import { TopBarAdmin } from "../../components/TopBarAdmin";

interface Admin extends AdminInterface {} // ใช้โครงสร้างเดิม
interface EducationalGroup { ID?: number; Name?: string; }
interface ContentCategory extends ContentCategoryInterface {}
interface EducationalContent extends EducationalContentInterface {
  PictureIn?: string;
  PictureOut?: string;
  Link?: string;
  Description?: string;
  Credit?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  Admin?: Admin;
  EducationalGroup?: EducationalGroup;
  ContentCategory?: ContentCategory;
}

const EducationalAdminPanel: React.FC = () => {
  // ======= Admin (อ่านจาก localStorage ถ้ามี) =======
  const getCurrentAdmin = (): Admin => {
    const id = Number(localStorage.getItem("id") || "0");
    const firstName = localStorage.getItem("firstName") || "ผู้ดูแลระบบ";
    const userName = localStorage.getItem("userName") || "admin";
    return { ID: id || 1, FirstName: firstName, UserName: userName } as Admin;
  };
  const [currentAdmin] = useState<Admin>(getCurrentAdmin());

  // ======= States หลัก =======
  const [educationalGroups, setEducationalGroups] = useState<EducationalGroup[]>([]);
  const [contentCategories, setContentCategories] = useState<ContentCategory[]>([]);
  const [educationalContents, setEducationalContents] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  // ฟิลเตอร์/ค้นหา + ฟอร์ม
  const [selectedGroup, setSelectedGroup] = useState<string>("ทั้งหมด");
  const [selectedCategory, setSelectedCategory] = useState<string>("ทั้งหมด");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<EducationalContent | null>(null);
  const [viewingItem, setViewingItem] = useState<EducationalContent | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<EducationalContent>({
    Title: "",
    PictureIn: "",
    PictureOut: "",
    Link: "",
    Description: "",
    Credit: "",
    AdminID: currentAdmin?.ID || 1,
    EducationalGroupID: undefined,
    ContentCategoryID: undefined,
    type: "" 
  });

  // ======= โหลดข้อมูลจาก backend =======
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    (async () => {
      try {
        // controllers ฝั่ง Go คืน {"menu": [...]} สำหรับ groups/categories/contents
        const [grpRes, catRes, contentRes] = await Promise.all([
          GetAllGroupContent(),
          GetAllCategory(),
          GetAllContent(),
        ]);

        if (!alive) return;

        const groups: EducationalGroup[] = grpRes?.data?.menu ?? [];
        const categories: ContentCategory[] = catRes?.data?.menu ?? [];
        const contents: EducationalContent[] = contentRes?.data?.menu ?? [];

        setEducationalGroups(groups);
        setContentCategories(categories);
        setEducationalContents(contents);
      } catch (e: any) {
        setErr(e?.message || "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // ======= Filtered list =======
  const filteredItems = useMemo(() => {
    return (educationalContents || []).filter((item) => {
      const group = educationalGroups.find((g) => g.ID === item.EducationalGroupID);
      const category = contentCategories.find((c) => c.ID === item.ContentCategoryID);

      const matchesGroup = selectedGroup === "ทั้งหมด" || group?.Name === selectedGroup;
      const matchesCategory = selectedCategory === "ทั้งหมด" || category?.Category === selectedCategory;
      const q = (searchTerm || "").toLowerCase();

      const matchesSearch =
        (item.Title || "").toLowerCase().includes(q) ||
        (item.Description || "").toLowerCase().includes(q);

      return matchesGroup && matchesCategory && matchesSearch;
    });
  }, [educationalContents, educationalGroups, contentCategories, selectedGroup, selectedCategory, searchTerm]);

  // ======= Helpers =======
  const scrollToFormAndFocus = () => {
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        const firstInput = formRef.current.querySelector('input[type="text"]') as HTMLInputElement | null;
        firstInput?.focus();
      }
    }, 100);
  };

  const resetForm = () => {
    setFormData({
      Title: "",
      PictureIn: "",
      PictureOut: "",
      Link: "",
      Description: "",
      Credit: "",
      AdminID: currentAdmin?.ID || 1,
      EducationalGroupID: undefined,
      ContentCategoryID: undefined,
      type: "" 
    });
  };

  const getGroupDisplayText = (groupId?: number) => {
    const group = educationalGroups.find((g) => g.ID === groupId);
    return group?.Name || "";
  };

  const getCategoryDisplayText = (categoryId?: number) => {
    const category = contentCategories.find((c) => c.ID === categoryId);
    return category?.Category || "";
  };

  // ======= Actions =======
  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingItem(null);
    resetForm();
    scrollToFormAndFocus();
  };

  const handleEdit = (item: EducationalContent) => {
    setEditingItem(item);
    setFormData({
      ...item,
      AdminID: item.AdminID ?? (currentAdmin?.ID || 1),
    });
    setShowAddForm(true);
    scrollToFormAndFocus();
  };

  const handleViewDetails = (item: EducationalContent) => setViewingItem(item);

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
    resetForm();
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    // optimistic UI
    const prev = educationalContents;
    setEducationalContents((s) => s.filter((x) => x.ID !== deleteId));

    const res = await DeleteContentAPI(deleteId);
    if (res?.status !== 200) {
      // rollback
      setEducationalContents(prev);
      alert(res?.data?.error || "ลบไม่สำเร็จ");
    }
    
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleSubmit = async () => {
    if (!formData.Title || !formData.EducationalGroupID || !formData.ContentCategoryID || !formData.Description) {
      alert("กรุณากรอกข้อมูลที่จำเป็น (หัวข้อ, หมวดหมู่, ประเภทเนื้อหา และคำอธิบาย)");
      return;
    }

    const payload: EducationalContent = {
      Title: formData.Title?.trim(),
      PictureIn: formData.PictureIn?.trim() || "",
      PictureOut: formData.PictureOut?.trim() || "",
      Link: formData.Link?.trim() || "",
      Description: formData.Description?.trim() || "",
      Credit: formData.Credit?.trim() || "",
      AdminID: currentAdmin?.ID || 1,
      EducationalGroupID: formData.EducationalGroupID,
      ContentCategoryID: formData.ContentCategoryID,
      type: "" 
    };

    if (editingItem?.ID) {
      // === Update ===
      const optimistic = educationalContents.map((x) =>
        x.ID === editingItem.ID ? { ...x, ...payload, UpdatedAt: new Date().toISOString() } : x
      );
      setEducationalContents(optimistic);

      const res = await UpdateContentAPI(editingItem.ID, payload);
      if (!res) {
        // rollback minimal (รีเฟรชใหม่)
        alert("แก้ไขไม่สำเร็จ (ตรวจสอบว่า backend มี PATCH /content/:id แล้วหรือยัง)");
        // ดึงใหม่จากเซิร์ฟเวอร์ให้สถานะล่าสุด
        const fresh = await GetAllContent();
        setEducationalContents(fresh?.data?.menu ?? []);
        return;
      }
      setEditingItem(null);
      setShowAddForm(false);
      resetForm();
    } else {
      // === Create ===
      // optimistic
      const tempId = Math.max(0, ...educationalContents.map((i) => i.ID || 0)) + 1;
      const optimistic: EducationalContent = {
        ...payload,
        ID: tempId,
        CreatedAt: new Date().toISOString(),
      };
      setEducationalContents((s) => [optimistic, ...s]);

      const res = await CreateContentAPI(payload);
      if (!res?.menu && !res?.id) {
        // rollback
        setEducationalContents((s) => s.filter((x) => x.ID !== tempId));
        alert("เพิ่มเนื้อหาไม่สำเร็จ");
        return;
      }

      // ดึงใหม่ให้ตรงกับ DB
      const fresh = await GetAllContent();
      setEducationalContents(fresh?.data?.menu ?? []);
      setShowAddForm(false);
      resetForm();
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  // ======= Render =======
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
              <p className="text-gray-600 mb-8 leading-relaxed">คุณแน่ใจหรือไม่ที่จะลบเนื้อหานี้?<br/>การกระทำนี้ไม่สามารถยกเลิกได้</p>
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
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                จัดการข่าวสารและการให้ความรู้
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                จัดการและควบคุมเนื้อหาการศึกษาและข้อมูลสุขภาพ
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
                <p className="text-white/80 text-sm mt-1">ค้นหาและกรองเนื้อหาการศึกษาที่ต้องการ</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">หมวดหมู่</label>
                <select
                  className="w-full border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none rounded-2xl px-4 py-3 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 text-gray-800"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  {educationalGroups.map(group => (
                    <option key={group.ID} value={group.Name}>{group.Name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">ประเภทเนื้อหา</label>
                <select
                  className="w-full border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none rounded-2xl px-4 py-3 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 text-gray-800"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  {contentCategories.map(category => (
                    <option key={category.ID} value={category.Category}>{category.Category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="block text-sm font-bold text-gray-700">ค้นหา</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="ค้นหาหัวข้อหรือเนื้อหา..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">&nbsp;</label>
                <button
                  onClick={handleAddNew}
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Plus className="w-5 h-5" />
                  เพิ่มเนื้อหาใหม่
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div ref={formRef} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-bold">
                      {editingItem ? "แก้ไขเนื้อหาการศึกษา" : "เพิ่มเนื้อหาการศึกษาใหม่"}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">
                      {editingItem ? "อัปเดตข้อมูลเนื้อหาการศึกษา" : "สร้างเนื้อหาการศึกษาใหม่สำหรับผู้ใช้"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleCancel}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-3 rounded-xl transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block font-bold text-gray-700 text-lg">
                    หัวข้อ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                    placeholder="ระบุหัวข้อเนื้อหา"
                    value={formData.Title || ''}
                    onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block font-bold text-gray-700 text-lg">
                    หมวดหมู่ <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                    value={formData.EducationalGroupID || ""}
                    onChange={(e) => setFormData({ ...formData, EducationalGroupID: Number(e.target.value) || undefined })}
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {educationalGroups.map((group) => (
                      <option key={group.ID} value={group.ID}>
                        {group.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block font-bold text-gray-700 text-lg">
                  ประเภทเนื้อหา <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                  value={formData.ContentCategoryID || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, ContentCategoryID: Number(e.target.value) || undefined })
                  }
                >
                  <option value="">เลือกประเภทเนื้อหา</option>
                  {contentCategories.map((category) => (
                    <option key={category.ID} value={category.ID}>
                      {category.Category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block font-bold text-gray-700 text-lg">URL รูปภาพหน้าปก</label>
                  <input
                    type="url"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                    placeholder="https://example.com/cover-image.jpg"
                    value={formData.PictureIn || ""}
                    onChange={(e) => setFormData({ ...formData, PictureIn: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block font-bold text-gray-700 text-lg">URL รูปภาพเนื้อหา</label>
                  <input
                    type="url"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                    placeholder="https://example.com/content-image.jpg"
                    value={formData.PictureOut || ""}
                    onChange={(e) => setFormData({ ...formData, PictureOut: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block font-bold text-gray-700 text-lg">ลิงก์เนื้อหา</label>
                  <input
                    type="url"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                    placeholder="https://example.com/article"
                    value={formData.Link || ""}
                    onChange={(e) => setFormData({ ...formData, Link: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block font-bold text-gray-700 text-lg">เครดิต/แหล่งที่มา</label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                    placeholder="ระบุแหล่งที่มาหรือเครดิต"
                    value={formData.Credit || ""}
                    onChange={(e) => setFormData({ ...formData, Credit: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block font-bold text-gray-700 text-lg">
                  คำอธิบาย <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg resize-none"
                  placeholder="ระบุคำอธิบายเนื้อหา..."
                  value={formData.Description || ""}
                  onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                />
              </div>

              <div className="border-t border-gray-200/50 pt-8">
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3 text-lg"
                  >
                    <Save className="w-6 h-6" />
                    <span>{editingItem ? 'บันทึกการแก้ไข' : 'บันทึกเนื้อหา'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-10 py-4 rounded-2xl font-bold border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 text-lg"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Educational Contents List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold">เนื้อหาการศึกษา ({filteredItems.length} รายการ)</h3>
                <p className="text-white/80 text-sm mt-1">จัดการและแก้ไขเนื้อหาการศึกษาทั้งหมด</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 min-h-96">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <BookOpen className="w-16 h-16 text-blue-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl opacity-20 rounded-full"></div>
                </div>
                <h3 className="text-3xl font-bold text-gray-600 mb-4">ยังไม่มีเนื้อหาการศึกษา</h3>
                <p className="text-gray-500 text-xl mb-8 max-w-md mx-auto leading-relaxed">
                  เริ่มต้นโดยการเพิ่มเนื้อหาการศึกษาแรกเข้าสู่ระบบ
                </p>
                <button 
                  onClick={handleAddNew}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto text-lg"
                >
                  <Plus className="w-6 h-6" />
                  <span>เพิ่มเนื้อหาแรก</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <div
                    key={item.ID}
                    className="group bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-white/50"
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                      {(item.PictureIn || item.PictureOut) ?  (
                        <img
                          src={item.PictureIn || item.PictureOut  }
                          alt={item.Title ?? ""}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-blue-400" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="p-2 bg-white/90 text-blue-600 rounded-xl hover:bg-white transition-all duration-200 shadow-lg backdrop-blur-sm"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-white/90 text-amber-600 rounded-xl hover:bg-white transition-all duration-200 shadow-lg backdrop-blur-sm"
                          title="แก้ไข"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.ID!)}
                          className="p-2 bg-white/90 text-red-600 rounded-xl hover:bg-white transition-all duration-200 shadow-lg backdrop-blur-sm"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.Link && (
                        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <a
                            href={item.Link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/90 text-green-600 rounded-xl hover:bg-white transition-all duration-200 shadow-lg backdrop-blur-sm"
                            title="เปิดลิงก์"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-2 line-clamp-2">
                          {item.Title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {item.Description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {getGroupDisplayText(item.EducationalGroupID) && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
                            📚 {getGroupDisplayText(item.EducationalGroupID)}
                          </span>
                        )}
                        {getCategoryDisplayText(item.ContentCategoryID) && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200">
                            📝 {getCategoryDisplayText(item.ContentCategoryID)}
                          </span>
                        )}
                      </div>

                      {item.CreatedAt && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">วันที่สร้าง:</span> {new Date(item.CreatedAt).toLocaleDateString("th-TH")}
                          </p>
                        </div>
                      )}

                      {item.Credit && (
                        <div className="pt-2">
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">เครดิต:</span> {item.Credit}
                          </p>
                        </div>
                      )}
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
          <div className="bg-white rounded-3xl shadow-2xl relative p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingItem(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{viewingItem.Title}</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              </div>
              
              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพหน้าปก</label>
                  <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-100 to-indigo-100 h-48">
                    {viewingItem.PictureIn ? (
                      <img
                        src={viewingItem.PictureIn}
                        alt="Cover Image"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-blue-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพเนื้อหา</label>
                  <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-100 to-indigo-100 h-48">
                    {viewingItem.PictureOut ? (
                      <img
                        src={viewingItem.PictureOut}
                        alt="Content Image"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-blue-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">หมวดหมู่</h3>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
                    📚 {getGroupDisplayText(viewingItem.EducationalGroupID)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-3">ประเภทเนื้อหา</h3>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200">
                    📝 {getCategoryDisplayText(viewingItem.ContentCategoryID)}
                  </span>
                </div>

                {viewingItem.CreatedAt && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3">วันที่สร้าง</h3>
                    <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-xl">
                      📅 {new Date(viewingItem.CreatedAt).toLocaleDateString("th-TH")}
                    </p>
                  </div>
                )}
              </div>
              
              {viewingItem.Description && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
                  <h3 className="font-bold text-gray-800 mb-3">คำอธิบาย</h3>
                  <p className="text-gray-700 leading-relaxed">{viewingItem.Description}</p>
                </div>
              )}
              
              {viewingItem.Credit && (
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h3 className="font-bold text-gray-800 mb-3">เครดิต/แหล่งที่มา</h3>
                  <p className="text-gray-700">{viewingItem.Credit}</p>
                </div>
              )}
              
              {viewingItem.Link && (
                <div className="bg-green-50 p-6 rounded-2xl">
                  <h3 className="font-bold text-gray-800 mb-3">ลิงก์เนื้อหา</h3>
                  <a
                    href={viewingItem.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {viewingItem.Link}
                  </a>
                </div>
              )}

              {(viewingItem.PictureIn || viewingItem.PictureOut) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingItem.PictureIn && (
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <h3 className="font-bold text-gray-800 mb-2">URL รูปภาพหน้าปก</h3>
                      <p className="text-sm text-gray-600 break-all">{viewingItem.PictureIn}</p>
                    </div>
                  )}

                  {viewingItem.PictureOut && (
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <h3 className="font-bold text-gray-800 mb-2">URL รูปภาพเนื้อหา</h3>
                      <p className="text-sm text-gray-600 break-all">{viewingItem.PictureOut}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-center space-x-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setViewingItem(null);
                    handleEdit(viewingItem);
                  }}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3"
                >
                  <Edit className="w-5 h-5" />
                  <span>แก้ไขเนื้อหา</span>
                </button>
                <button
                  onClick={() => setViewingItem(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-2xl font-bold border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalAdminPanel;