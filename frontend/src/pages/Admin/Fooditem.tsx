import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, Filter,Eye } from 'lucide-react';
import type { FoodFlagInterface } from '../../interfaces/FoodFlag';
import type { FoodItemInterface } from '../../interfaces/FoodItem';
import type { FoodGroupInterface } from '../../interfaces/FoodGroup';
import { GetAllFoodFlags, GetAllFoodItems, GetAllFoodGroups, CreateFoodItem} from "../../services/https";

const FoodAdminPanel = () => {
  // Sample data
  const [foodGroups, setfoodGroups] = useState<FoodGroupInterface[]>([]);

  const [foodFlags, setfoodFlags] = useState<FoodFlagInterface[]>([]);

  const [foodItems, setFoodItems] = useState<FoodItemInterface[]>([]);

  // State management
  const [selectedGroup, setSelectedGroup] = useState<string>('ทั้งหมด');
  const [selectedFlag, setSelectedFlag] = useState<string>('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<FoodItemInterface | null>(null);
  const [viewingItem, setViewingItem] = useState<FoodItemInterface | null>(null);
  const [error, setError] = useState("");
  // Ref for form section
  const formRef = useRef<HTMLDivElement>(null);

  const getAllFoodFlags = async () => {
    try {
      const res = await GetAllFoodFlags(); // สมมติว่ามี API นี้ดึงแท็กทั้งหมด
      // console.log(res?.data)
      if (Array.isArray(res?.data?.foodflags)) {
        setfoodFlags(res.data.foodflags);
      } else {
        setError("Failed to load Food Flags");
      }
    } catch (error) {
      setError("Error fetching Food Flags. Please try again later.");
    }
  };

  const getAllFoodItems = async () => {
  try {
    const res = await GetAllFoodItems();
    // console.log(res?.data?.fooditems);

    if (Array.isArray(res?.data?.fooditems)) {
      setFoodItems(res.data.fooditems);
    } else {
      setError("Failed to load Food Items");
    }
  } catch (error) {
    setError("Error fetching Food Items. Please try again later.");
  }
};

  const getAllFoodGroups = async () => {
  try {
    const res = await GetAllFoodGroups();
    console.log(res?.data?.foodgroups);

    if (Array.isArray(res?.data?.foodgroups)) {
      setfoodGroups(res.data.foodgroups);
    } else {
      setError("Failed to load Food Group");
    }
  } catch (error) {
    setError("Error fetching Food Group. Please try again later.");
  }
};


  useEffect(() => {
    getAllFoodFlags();
    getAllFoodItems();
    getAllFoodGroups();
    
  }, []);

  // Form state
  const [formData, setFormData] = useState<FoodItemInterface>({
    Name: '',
    Image: '',
    Credit: '',
    Description: '',
    FoodFlagID: undefined
  });

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
    alert("กรุณากรอกข้อมูลที่จำเป็น");
    return;
  }

  try {
    if (editingItem) {
      // ✅ เรียก API update
      const updatedItem = { ...formData, ID: editingItem.ID };
      // await UpdateFoodItem(editingItem.ID, updatedItem);

      setFoodItems(items =>
        items.map(item =>
          item.ID === editingItem.ID ? updatedItem : item
        )
      );

      setEditingItem(null);
      alert("แก้ไขข้อมูลสำเร็จ");
    } else {
      // ✅ เรียก API create
      const res = await CreateFoodItem(formData);

      // backend น่าจะส่ง object ที่มี ID กลับมา
      const newItem: FoodItemInterface = res;

      setFoodItems(items => [...items, newItem]);
      alert("เพิ่มข้อมูลสำเร็จ");

      setTimeout(() => {
        window.location.reload();
      }, 100); // 1 วินาที
    }

    // reset form
    setFormData({ Name: "", Image: "", Credit: "", Description: "", FoodFlagID: undefined });
    setShowAddForm(false);
  } catch (error) {
    console.error("Error:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  }
};


   // ปรับปรุงฟังก์ชัน handleEdit ให้ scroll ได้ดีขึ้น
  const handleEdit = (item: FoodItemInterface) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddForm(true);
    
    // ใช้ setTimeout เพื่อให้แน่ใจว่าฟอร์มถูก render แล้ว
    // และเพิ่มเวลาเป็น 300ms เพื่อให้เห็นการเปลี่ยนแปลงชัดเจน
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
        
        // เพิ่มการ focus ไปที่ input แรกด้วย
        const firstInput = formRef.current.querySelector('input[type="text"]') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 300);
  };

  // ปรับปรุงฟังก์ชันเพิ่มรายการใหม่ให้ scroll ด้วย
  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingItem(null);
    setFormData({ Name: '', Image: '', Credit: '', Description: '', FoodFlagID: undefined });
    
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
    }, 100);
  };


   // Handle view details
  const handleViewDetails = (item: FoodItemInterface) => {
    setViewingItem(item);
  };
  
  // Handle delete
  const handleDelete = (id: number) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      setFoodItems(items => items.filter(item => item.ID !== id));
    }
  };

  // Cancel form
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

  const getStatistics = () => {
    const recommended = filteredItems.filter(item => getFlagDisplayText(item.FoodFlagID) === 'ควรรับประทาน').length;
    const avoid = filteredItems.filter(item => getFlagDisplayText(item.FoodFlagID) === 'ควรหลีกเลี่ยง').length;
    return { recommended, avoid, total: filteredItems.length };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">จัดการรายการอาหารที่ควรรับประทานและควรหลีกเลี่ยง</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">ตัวกรองและค้นหา</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  {foodGroups.map(group => (
                    <option key={group.ID} value={group.Name}>{group.Name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">คำแนะนำ</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={selectedFlag}
                  onChange={(e) => setSelectedFlag(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  <option value="ควรรับประทาน">ควรรับประทาน</option>
                  <option value="ควรหลีกเลี่ยง">ควรหลีกเลี่ยง</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่ออาหาร..."
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  เพิ่มรายการใหม่
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div ref={formRef} className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 scroll-mt-8">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? '✏️ แก้ไขรายการอาหาร' : '➕ เพิ่มรายการอาหารใหม่'}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่ออาหาร <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="ระบุชื่ออาหาร"
                      value={formData.Name || ''}
                      onChange={(e) => setFormData({...formData, Name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ประเภท <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={formData.FoodFlagID || ''}
                      onChange={(e) => setFormData({...formData, FoodFlagID: Number(e.target.value)})}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="คำอธิบายเกี่ยวกับอาหารชนิดนี้"
                    value={formData.Description || ''}
                    onChange={(e) => setFormData({...formData, Description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL รูปภาพ</label>
                  <input
                    type="url"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com/image.jpg"
                    value={formData.Image || ''}
                    onChange={(e) => setFormData({...formData, Image: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เครดิตรูปภาพ</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="แหล่งที่มาของรูปภาพ"
                    value={formData.Credit || ''}
                    onChange={(e) => setFormData({...formData, Credit: e.target.value})}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    {editingItem ? 'บันทึกการแก้ไข' : 'เพิ่มรายการ'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Food Items List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">รายการอาหาร ({filteredItems.length} รายการ)</h3>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">🍽️</div>
              </div>
              <p className="text-gray-500 text-lg mb-2">ไม่พบรายการอาหาร</p>
              <p className="text-gray-400 text-sm">ลองเปลี่ยนเงื่อนไขการค้นหาหรือเพิ่มรายการใหม่</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <div key={item.ID} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                        {item.Image ? (
                          <img 
                            src={item.Image} 
                            alt={item.Name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs text-center">📸</div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.Name}</h4>
                        
                        {item.Description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.Description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {getGroupDisplayText(item.FoodFlagID)}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            getFlagDisplayText(item.FoodFlagID) === 'ควรรับประทาน' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {getFlagDisplayText(item.FoodFlagID) === 'ควรรับประทาน' ? '✓' : '✗'} {getFlagDisplayText(item.FoodFlagID)}
                          </span>
                        </div>
                        
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="p-2.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-200 shadow-sm"
                        title="ดูรายละเอียด"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 shadow-sm"
                        title="แก้ไข"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.ID!)}
                        className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 shadow-sm"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* View Details Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">รายละเอียดอาหาร</h3>
                <button
                  onClick={() => setViewingItem(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Image */}
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                    {viewingItem.Image ? (
                      <img 
                        src={viewingItem.Image} 
                        alt={viewingItem.Name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                        📸
                      </div>
                    )}
                  </div>
                  {viewingItem.Credit && (
                    <p className="text-sm text-gray-500 mt-2">
                      📸 แหล่งรูปภาพ: {viewingItem.Credit}
                    </p>
                  )}
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่ออาหาร</label>
                    <p className="text-lg font-semibold text-gray-900">{viewingItem.Name}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {getGroupDisplayText(viewingItem.FoodFlagID)}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">คำแนะนำ</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        getFlagDisplayText(viewingItem.FoodFlagID) === 'ควรรับประทาน' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {getFlagDisplayText(viewingItem.FoodFlagID) === 'ควรรับประทาน' ? '✓' : '✗'} {getFlagDisplayText(viewingItem.FoodFlagID)}
                      </span>
                    </div>
                  </div>

                  {viewingItem.Description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">{viewingItem.Description}</p>
                      </div>
                    </div>
                  )}

                  {viewingItem.Image && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ</label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 break-all">{viewingItem.Image}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setViewingItem(null);
                      handleEdit(viewingItem);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                    แก้ไขรายการ
                  </button>
                  <button
                    onClick={() => setViewingItem(null)}
                    className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200"
                  >
                    ปิด
                  </button>
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