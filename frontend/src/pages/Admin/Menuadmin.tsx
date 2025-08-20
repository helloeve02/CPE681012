import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, Filter, Hash } from 'lucide-react';
import type { MenuInterface } from '../../interfaces/Menu';
import type { TagInterface } from '../../interfaces/Tag';

const MenuAdminPanel = () => {
  // Sample tags data
  const [availableTags] = useState<TagInterface[]>([
    { ID: 1, Name: 'มังสวิรัติ' },
    { ID: 2, Name: 'คีโต' },
    { ID: 3, Name: 'ลดน้ำหนัก' },
    { ID: 4, Name: 'เพิ่มกล้ามเนื้อ' },
    { ID: 5, Name: 'อาหารเช้า' },
    { ID: 6, Name: 'อาหารกลางวัน' },
    { ID: 7, Name: 'อาหารเย็น' },
    { ID: 8, Name: 'ของหวาน' },
    { ID: 9, Name: 'อาหารไทย' },
    { ID: 10, Name: 'อาหารสากล' }
  ]);

  // Sample regions
  const regions = ['ภาคเหนือ', 'ภาคกลาง', 'ภาคอีสาน', 'ภาคใต้', 'สากล'];

  // Sample menu data
  const [menus, setMenus] = useState<MenuInterface[]>([
    {
      ID: 1,
      Title: 'ส้มตำไทย',
      Description: 'ส้มตำรสจัดจ้าน เสิร์ฟพร้อมผักสด เหมาะสำหรับคนรักสุขภาพ',
      Region: 'ภาคอีสาน',
      Image: '/api/placeholder/300/200',
      Credit: 'Unsplash',
      Tags: [
        { ID: 3, Name: 'ลดน้ำหนัก' },
        { ID: 6, Name: 'อาหารกลางวัน' },
        { ID: 9, Name: 'อาหารไทย' }
      ]
    },
    {
      ID: 2,
      Title: 'แกงเขียวหวานไก่',
      Description: 'แกงเขียวหวานไก่แสนอร่อย เสิร์ฟร้อนๆ พร้อมข้าวหอมมะลิ',
      Region: 'ภาคกลาง',
      Image: '/api/placeholder/300/200',
      Credit: 'Getty Images',
      Tags: [
        { ID: 4, Name: 'เพิ่มกล้ามเนื้อ' },
        { ID: 7, Name: 'อาหารเย็น' },
        { ID: 9, Name: 'อาหารไทย' }
      ]
    },
    {
      ID: 3,
      Title: 'สลัดผลไม้',
      Description: 'สลัดผลไม้สดใหม่หลากสี ราดด้วยน้ำสลัดโยเกิร์ต',
      Region: 'สากล',
      Image: '/api/placeholder/300/200',
      Credit: 'Freepik',
      Tags: [
        { ID: 1, Name: 'มังสวิรัติ' },
        { ID: 3, Name: 'ลดน้ำหนัก' },
        { ID: 5, Name: 'อาหารเช้า' }
      ]
    }
  ]);

  // State management
  const [selectedRegion, setSelectedRegion] = useState<string>('ทั้งหมด');
  const [selectedTag, setSelectedTag] = useState<string>('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuInterface | null>(null);

  // Form state
  const [formData, setFormData] = useState<MenuInterface>({
    Title: '',
    Description: '',
    Region: '',
    Image: '',
    Credit: '',
    Tags: []
  });

  const [selectedFormTags, setSelectedFormTags] = useState<number[]>([]);

  // Filter menus
  const filteredItems = menus.filter(menu => {
    const matchesRegion = selectedRegion === 'ทั้งหมด' || menu.Region === selectedRegion;
    const matchesTag = selectedTag === 'ทั้งหมด' || menu.Tags.some(tag => tag.Name === selectedTag);
    const matchesSearch = menu.Title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         menu.Description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    
    return matchesRegion && matchesTag && matchesSearch;
  });

  // Handle form submission
  const handleSubmit = () => {
    if (!formData.Title || !formData.Description || !formData.Region) {
      alert('กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    const selectedTags = availableTags.filter(tag => selectedFormTags.includes(tag.ID!));
    const menuData = { ...formData, Tags: selectedTags };
    
    if (editingItem) {
      setMenus(items => 
        items.map(item => 
          item.ID === editingItem.ID ? { ...menuData, ID: editingItem.ID } : item
        )
      );
      setEditingItem(null);
    } else {
      const newItem: MenuInterface = {
        ...menuData,
        ID: Math.max(...menus.map(i => i.ID || 0)) + 1
      };
      setMenus(items => [...items, newItem]);
    }
    
    setFormData({ Title: '', Description: '', Region: '', Image: '', Credit: '', Tags: [] });
    setSelectedFormTags([]);
    setShowAddForm(false);
  };

  // Handle edit
  const handleEdit = (item: MenuInterface) => {
    setEditingItem(item);
    setFormData(item);
    setSelectedFormTags(item.Tags.map(tag => tag.ID!).filter(id => id !== undefined));
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบเมนูนี้?')) {
      setMenus(items => items.filter(item => item.ID !== id));
    }
  };

  // Cancel form
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({ Title: '', Description: '', Region: '', Image: '', Credit: '', Tags: [] });
    setSelectedFormTags([]);
  };

  // Handle tag selection
  const handleTagToggle = (tagId: number) => {
    setSelectedFormTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const getStatistics = () => {
    const byRegion = regions.reduce((acc, region) => {
      acc[region] = filteredItems.filter(item => item.Region === region).length;
      return acc;
    }, {} as Record<string, number>);
    
    return { 
      total: filteredItems.length,
      byRegion
    };
  };

  const stats = getStatistics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">จัดการเมนูอาหารแนะนำ</h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>ทั้งหมด: {stats.total} เมนู</span>
            {Object.entries(stats.byRegion).map(([region, count]) => (
              count > 0 && <span key={region}>{region}: {count} เมนู</span>
            ))}
          </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">ภูมิภาค</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">แท็ก</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  {availableTags.map(tag => (
                    <option key={tag.ID} value={tag.Name}>{tag.Name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อเมนูหรือรายละเอียด..."
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  เพิ่มเมนูใหม่
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
                {editingItem ? '✏️ แก้ไขเมนูอาหาร' : '➕ เพิ่มเมนูอาหารใหม่'}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อเมนู <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="ระบุชื่อเมนู"
                      value={formData.Title || ''}
                      onChange={(e) => setFormData({...formData, Title: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ภูมิภาค <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      value={formData.Region || ''}
                      onChange={(e) => setFormData({...formData, Region: e.target.value})}
                    >
                      <option value="">เลือกภูมิภาค</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รายละเอียด <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="อธิบายรายละเอียดของเมนู"
                    value={formData.Description || ''}
                    onChange={(e) => setFormData({...formData, Description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL รูปภาพ</label>
                  <input
                    type="url"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com/image.jpg"
                    value={formData.Image || ''}
                    onChange={(e) => setFormData({...formData, Image: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เครดิตรูปภาพ</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="แหล่งที่มาของรูปภาพ"
                    value={formData.Credit || ''}
                    onChange={(e) => setFormData({...formData, Credit: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">แท็ก</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {availableTags.map(tag => (
                      <label key={tag.ID} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFormTags.includes(tag.ID!)}
                          onChange={() => handleTagToggle(tag.ID!)}
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{tag.Name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    {editingItem ? 'บันทึกการแก้ไข' : 'เพิ่มเมนู'}
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

        {/* Menu Items List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">รายการเมนูอาหาร ({filteredItems.length} เมนู)</h3>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">🍽️</div>
              </div>
              <p className="text-gray-500 text-lg mb-2">ไม่พบเมนูอาหาร</p>
              <p className="text-gray-400 text-sm">ลองเปลี่ยนเงื่อนไขการค้นหาหรือเพิ่มเมนูใหม่</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredItems.map((menu) => (
                <div key={menu.ID} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                        {menu.Image ? (
                          <img 
                            src={menu.Image} 
                            alt={menu.Title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs text-center">📸</div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{menu.Title}</h4>
                        <p className="text-gray-600 mb-3 leading-relaxed">{menu.Description}</p>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            📍 {menu.Region}
                          </span>
                        </div>
                        
                        {menu.Tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {menu.Tags.map(tag => (
                              <span key={tag.ID} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                <Hash className="w-3 h-3 mr-1" />
                                {tag.Name}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {menu.Credit && (
                          <p className="text-sm text-gray-500">
                            📸 แหล่งรูปภาพ: {menu.Credit}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(menu)}
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 shadow-sm"
                        title="แก้ไข"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(menu.ID!)}
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

export default MenuAdminPanel;