import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, Filter, Eye, ArrowLeft, UtensilsCrossed } from 'lucide-react';
import type { FoodFlagInterface } from '../../interfaces/FoodFlag';
import type { FoodItemInterface } from '../../interfaces/FoodItem';
import type { FoodGroupInterface } from '../../interfaces/FoodGroup';
import { GetAllFoodFlags, GetAllFoodItems, GetAllFoodGroups, CreateFoodItem, DeleteFoodItem } from "../../services/https";
import { message } from "antd";
import { TopBarAdmin } from '../../components/TopBarAdmin';

const FoodAdminPanel = () => {
  // State management
  const [foodGroups, setfoodGroups] = useState<FoodGroupInterface[]>([]);
  const [foodFlags, setfoodFlags] = useState<FoodFlagInterface[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItemInterface[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('ทั้งหมด');
  const [selectedFlag, setSelectedFlag] = useState<string>('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<FoodItemInterface | null>(null);
  const [viewingItem, setViewingItem] = useState<FoodItemInterface | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);
  
  // Ref for form section
  const formRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState<FoodItemInterface>({
    Name: '',
    Image: '',
    Credit: '',
    Description: '',
    FoodFlagID: undefined
  });

  const getAllFoodFlags = async () => {
    try {
      const res = await GetAllFoodFlags();
      if (Array.isArray(res?.data?.foodflags)) {
        setfoodFlags(res.data.foodflags);
      } else {
        throw new Error("Failed to load Food Flags");
      }
    } catch (error: any) {
      throw error;
    }
  };

  const getAllFoodItems = async () => {
    try {
      const res = await GetAllFoodItems();
      if (Array.isArray(res?.data?.fooditems)) {
        setFoodItems(res.data.fooditems);
      } else {
        throw new Error("Failed to load Food Items");
      }
    } catch (error: any) {
      throw error;
    }
  };

  const getAllFoodGroups = async () => {
    try {
      const res = await GetAllFoodGroups();
      console.log(res?.data?.foodgroups);
      if (Array.isArray(res?.data?.foodgroups)) {
        setfoodGroups(res.data.foodgroups);
      } else {
        throw new Error("Failed to load Food Group");
      }
    } catch (error: any) {
      throw error;
    }
  };

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    (async () => {
      try {
        await Promise.all([getAllFoodFlags(), getAllFoodItems(), getAllFoodGroups()]);
      } catch (error: any) {
        if (alive) {
          setErr(error?.message || "โหลดข้อมูลไม่สำเร็จ");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Filter food items
  const filteredItems = foodItems.filter(item => {
    const flag = foodFlags.find(f => f.ID === item.FoodFlagID);
    const group = foodGroups.find(g => g.ID === flag?.FoodGroupID);

    const matchesGroup = selectedGroup === 'ทั้งหมด' || group?.Name === selectedGroup;
    const matchesFlag = selectedFlag === 'ทั้งหมด' || flag?.Flag === selectedFlag;
    const matchesSearch = item.Name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;

    return matchesGroup && matchesFlag && matchesSearch;
  });

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.Name || !formData.FoodFlagID) {
      message.warning("กรุณากรอกข้อมูลที่จำเป็น");
      return;
    }

    try {
      if (editingItem) {
        const updatedItem = { ...formData, ID: editingItem.ID };
        setFoodItems(items =>
          items.map(item =>
            item.ID === editingItem.ID ? updatedItem : item
          )
        );
        setEditingItem(null);
        message.success("แก้ไขข้อมูลสำเร็จ");
      } else {
        const res = await CreateFoodItem(formData);
        const newItem: FoodItemInterface = res;
        setFoodItems(items => [...items, newItem]);
        message.success("เพิ่มข้อมูลสำเร็จ");
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      setFormData({ Name: "", Image: "", Credit: "", Description: "", FoodFlagID: undefined });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleEdit = (item: FoodItemInterface) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddForm(true);

    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
        const firstInput = formRef.current.querySelector('input[type="text"]') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 300);
  };

  const handleViewDetails = (item: FoodItemInterface) => {
    setViewingItem(item);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    try {
      const res = await DeleteFoodItem(deleteId);
      if (res.status === 200) {
        setFoodItems(items => items.filter(item => item.ID !== deleteId));
        message.success('ลบรายการอาหารสำเร็จ');
      } else {
        message.error('ไม่สามารถลบรายการอาหารได้');
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบ:", error);
      message.error('เกิดข้อผิดพลาดในการลบรายการอาหาร');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({ Name: '', Image: '', Credit: '', Description: '', FoodFlagID: undefined });
  };

  const getFlagDisplayText = (flagId?: number) => {
    const flag = foodFlags.find(f => f.ID === flagId);
    return flag?.Flag || '';
  };

  const getGroupDisplayText = (flagId?: number) => {
    const flag = foodFlags.find(f => f.ID === flagId);
    const group = foodGroups.find(g => g.ID === flag?.FoodGroupID);
    return group?.Name || '';
  };

  const handleGoBack = () => {
    window.history.back();
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-kanit">
      <TopBarAdmin />

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 font-kanit">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">คุณแน่ใจหรือไม่ที่จะลบรายการอาหารนี้?<br/>การกระทำนี้ไม่สามารถยกเลิกได้</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl transition-all duration-200 font-semibold border-2 border-transparent hover:border-gray-300"
                  disabled={isDeleting}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  disabled={isDeleting}
                >
                  {isDeleting ? "กำลังลบ..." : "ลบทันที"}
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
                  <UtensilsCrossed className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                จัดการรายการอาหารที่ควรรับประทานและควรหลีกเลี่ยง
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                จัดการและควบคุมรายการอาหารที่แนะนำให้กับผู้ใช้งาน
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
                <p className="text-white/80 text-sm mt-1">ค้นหาและกรองรายการอาหารที่ต้องการ</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">หมวดหมู่</label>
                <select
                  className="w-full border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none rounded-2xl px-4 py-3 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 text-gray-800"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  {foodGroups.map(group => (
                    <option key={group.ID} value={group.Name}>{group.Name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">คำแนะนำ</label>
                <select
                  className="w-full border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none rounded-2xl px-4 py-3 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 text-gray-800"
                  value={selectedFlag}
                  onChange={(e) => setSelectedFlag(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  <option value="ควรรับประทาน">ควรรับประทาน</option>
                  <option value="ควรหลีกเลี่ยง">ควรหลีกเลี่ยง</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">ค้นหา</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="ค้นหาชื่ออาหาร..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">&nbsp;</label>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Plus className="w-5 h-5" />
                  เพิ่มรายการใหม่
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
                    <UtensilsCrossed className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-bold">
                      {editingItem ? "แก้ไขรายการอาหาร" : "เพิ่มรายการอาหารใหม่"}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">
                      {editingItem ? "อัปเดตข้อมูลรายการอาหาร" : "สร้างรายการอาหารใหม่สำหรับผู้ใช้"}
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
                    ชื่ออาหาร <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                    placeholder="ระบุชื่ออาหาร"
                    value={formData.Name || ''}
                    onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block font-bold text-gray-700 text-lg">
                    ประเภท <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                    value={formData.FoodFlagID || ''}
                    onChange={(e) => setFormData({ ...formData, FoodFlagID: Number(e.target.value) })}
                  >
                    <option value="">เลือกประเภท</option>
                    {foodFlags.map(flag => {
                      const group = foodGroups.find(g => g.ID === flag.FoodGroupID);
                      return (
                        <option key={flag.ID} value={flag.ID}>
                          {group?.Name} - {flag.Flag}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block font-bold text-gray-700 text-lg">คำอธิบาย</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg resize-none"
                  placeholder="คำอธิบายเกี่ยวกับอาหารชนิดนี้"
                  value={formData.Description || ''}
                  onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="block font-bold text-gray-700 text-lg">URL รูปภาพ</label>
                <input
                  type="url"
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                  placeholder="https://example.com/image.jpg"
                  value={formData.Image || ''}
                  onChange={(e) => setFormData({ ...formData, Image: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="block font-bold text-gray-700 text-lg">เครดิตรูปภาพ</label>
                <input
                  type="text"
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                  placeholder="แหล่งที่มาของรูปภาพ"
                  value={formData.Credit || ''}
                  onChange={(e) => setFormData({ ...formData, Credit: e.target.value })}
                />
              </div>

              <div className="border-t border-gray-200/50 pt-8">
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3 text-lg"
                  >
                    <Save className="w-6 h-6" />
                    <span>{editingItem ? 'บันทึกการแก้ไข' : 'เพิ่มรายการ'}</span>
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

        {/* Food Items List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold">รายการอาหาร ({filteredItems.length} รายการ)</h3>
                <p className="text-white/80 text-sm mt-1">จัดการและแก้ไขรายการอาหารทั้งหมด</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 min-h-96">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <UtensilsCrossed className="w-16 h-16 text-blue-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl opacity-20 rounded-full"></div>
                </div>
                <h3 className="text-3xl font-bold text-gray-600 mb-4">ยังไม่มีรายการอาหาร</h3>
                <p className="text-gray-500 text-xl mb-8 max-w-md mx-auto leading-relaxed">
                  เริ่มต้นโดยการเพิ่มรายการอาหารแรกเข้าสู่ระบบ
                </p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto text-lg"
                >
                  <Plus className="w-6 h-6" />
                  <span>เพิ่มรายการแรก</span>
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
                      {item.Image ? (
                        <img
                          src={item.Image}
                          alt={item.Name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UtensilsCrossed className="w-16 h-16 text-blue-400" />
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
                          onClick={() => setDeleteId(item.ID!)}
                          className="p-2 bg-white/90 text-red-600 rounded-xl hover:bg-white transition-all duration-200 shadow-lg backdrop-blur-sm"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                          {item.Name}
                        </h4>
                        {item.Description && (
                          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-3">
                            {item.Description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
                          {getGroupDisplayText(item.FoodFlagID)}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getFlagDisplayText(item.FoodFlagID) === 'ควรรับประทาน'
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                          : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                        }`}>
                          {getFlagDisplayText(item.FoodFlagID) === 'ควรรับประทาน' ? '✓' : '✗'} {getFlagDisplayText(item.FoodFlagID)}
                        </span>
                      </div>

                      {item.Credit && (
                        <div className="pt-3 border-t border-gray-100">
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

      {/* View Details Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-kanit">
          <div className="bg-white rounded-3xl shadow-2xl relative p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingItem(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{viewingItem.Name}</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              </div>
              
              {viewingItem.Image && (
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={viewingItem.Image}
                    alt={viewingItem.Name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              
              {viewingItem.Description && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
                  <h3 className="font-bold text-gray-800 mb-3">คำอธิบาย</h3>
                  <p className="text-gray-700 leading-relaxed">{viewingItem.Description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">หมวดหมู่</h3>
                  <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
                    {getGroupDisplayText(viewingItem.FoodFlagID)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-3">คำแนะนำ</h3>
                  <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getFlagDisplayText(viewingItem.FoodFlagID) === 'ควรรับประทาน'
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                  }`}>
                    {getFlagDisplayText(viewingItem.FoodFlagID) === 'ควรรับประทาน' ? '✓' : '✗'} {getFlagDisplayText(viewingItem.FoodFlagID)}
                  </span>
                </div>
              </div>
              
              {viewingItem.Image && (
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <h3 className="font-bold text-gray-800 mb-2">URL รูปภาพ</h3>
                  <p className="text-sm text-gray-600 break-all">{viewingItem.Image}</p>
                </div>
              )}
              
              {viewingItem.Credit && (
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">เครดิตรูปภาพ:</span> {viewingItem.Credit}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setViewingItem(null);
                    handleEdit(viewingItem);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg font-semibold"
                >
                  <Edit className="w-4 h-4" />
                  แก้ไขรายการ
                </button>
                <button
                  onClick={() => setViewingItem(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl transition-all duration-200 font-semibold"
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

export default FoodAdminPanel;