import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, Filter } from 'lucide-react';
import type { FoodFlagInterface } from '../../interfaces/FoodFlag';
import type { FoodItemInterface } from '../../interfaces/FoodItem';
import type { FoodGroupInterface } from '../../interfaces/FoodGroup';
import { GetAllFoodFlags, GetAllFoodItems} from "../../services/https";

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
  const [error, setError] = useState("");
  
  const getAllFoodFlags = async () => {
    try {
      const res = await GetAllFoodFlags(); // สมมติว่ามี API นี้ดึงแท็กทั้งหมด
      console.log(res?.data)
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
    console.log(res?.data?.fooditems);

    if (Array.isArray(res?.data?.fooditems)) {
      setFoodItems(res.data.fooditems);
    } else {
      setError("Failed to load Food Items");
    }
  } catch (error) {
    setError("Error fetching Food Items. Please try again later.");
  }
};


  useEffect(() => {
    getAllFoodFlags();
    getAllFoodItems();
    
  }, []);

  // Form state
  const [formData, setFormData] = useState<FoodItemInterface>({
    Name: '',
    Image: '',
    Credit: '',
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
  const handleSubmit = () => {
    if (!formData.Name || !formData.FoodFlagID) {
      alert('กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }
    
    if (editingItem) {
      setFoodItems(items => 
        items.map(item => 
          item.ID === editingItem.ID ? { ...formData, ID: editingItem.ID } : item
        )
      );
      setEditingItem(null);
    } else {
      const newItem: FoodItemInterface = {
        ...formData,
        ID: Math.max(...foodItems.map(i => i.ID || 0)) + 1
      };
      setFoodItems(items => [...items, newItem]);
    }
    
    setFormData({ Name: '', Image: '', Credit: '', FoodFlagID: undefined });
    setShowAddForm(false);
  };

  // Handle edit
  const handleEdit = (item: FoodItemInterface) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddForm(true);
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
    setFormData({ Name: '', Image: '', Credit: '', FoodFlagID: undefined });
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
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
                        
                        {item.Credit && (
                          <p className="text-sm text-gray-500">
                            📸 แหล่งรูปภาพ: {item.Credit}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
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
    </div>
  );
};

export default FoodAdminPanel;