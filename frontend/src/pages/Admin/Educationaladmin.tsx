import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, Filter, ExternalLink, BookOpen } from 'lucide-react';

// Interfaces matching Go entities
interface Admin {
  ID?: number;
  Name?: string;
  Email?: string;
}

interface EducationalGroup {
  ID?: number;
  Name?: string;
  EducationalContents?: EducationalContent[];
}

interface EducationalContent {
  ID?: number;
  Title?: string;
  Picture?: string;
  Link?: string;
  Description?: string;
  AdminID?: number;
  Admin?: Admin;
  EducationalGroupID?: number;
  EducationalGroup?: EducationalGroup;
  CreatedAt?: string;
  UpdatedAt?: string;
}

const EducationalAdminPanel = () => {
  // Sample data for demo (in real app, this would come from API)
  const [educationalGroups] = useState<EducationalGroup[]>([
    { ID: 1, Name: 'โภชนาการและอาหาร' },
    { ID: 2, Name: 'การออกกำลังกาย' },
    { ID: 3, Name: 'สุขภาพจิต' },
    { ID: 4, Name: 'การดูแลตนเอง' }
  ]);

  // Get current admin from localStorage
  const getCurrentAdmin = (): Admin => {
    try {
      const adminData = localStorage.getItem('admin');
      if (adminData) {
        return JSON.parse(adminData);
      }
    } catch (error) {
      console.error('Error reading admin data from localStorage:', error);
    }
    // Fallback if no admin data found
    return { ID: 1, Name: 'ผู้ดูแลระบบ', Email: 'admin@example.com' };
  };

  const [currentAdmin] = useState<Admin>(getCurrentAdmin());

  const [educationalContents, setEducationalContents] = useState<EducationalContent[]>([
    {
      ID: 1,
      Title: '5 อาหารที่ช่วยลดความดันโลหิต',
      Picture: '/api/placeholder/300/200',
      Link: 'https://example.com/article-1',
      Description: 'แนะนำอาหารที่มีสารอาหารสำคัญที่ช่วยในการควบคุมความดันโลหิตให้อยู่ในเกณฑ์ปกติ พร้อมคำแนะนำในการปรุงอาหารที่ถูกต้อง',
      AdminID: 1,
      EducationalGroupID: 1,
      CreatedAt: '2024-01-15'
    },
    {
      ID: 2,
      Title: 'การออกกำลังกายเบาๆ สำหรับผู้สูงอายุ',
      Picture: '/api/placeholder/300/200',
      Link: 'https://example.com/article-2',
      Description: 'ท่าออกกำลังกายง่ายๆ ที่เหมาะสำหรับผู้สูงอายุและผู้ที่มีข้อจำกัดในการเคลื่อนไหว เพื่อสร้างความแข็งแรงให้กับร่างกาย',
      AdminID: 1,
      EducationalGroupID: 2,
      CreatedAt: '2024-01-20'
    },
    {
      ID: 3,
      Title: 'เทคนิคการจัดการความเครียด',
      Picture: '/api/placeholder/300/200',
      Link: 'https://example.com/article-3',
      Description: 'วิธีการจัดการกับความเครียดในชีวิตประจำวัน ด้วยเทคนิคง่ายๆ ที่สามารถทำได้ที่บ้าน รวมถึงการหายใจและการผ่อนคลาย',
      AdminID: 1,
      EducationalGroupID: 3,
      CreatedAt: '2024-01-25'
    }
  ]);

  // State management
  const [selectedGroup, setSelectedGroup] = useState<string>('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<EducationalContent | null>(null);

  // Form state
  const [formData, setFormData] = useState<EducationalContent>({
    Title: '',
    Picture: '',
    Link: '',
    Description: '',
    AdminID: currentAdmin.ID,
    EducationalGroupID: undefined
  });

  // Filter educational contents
  const filteredItems = educationalContents.filter(item => {
    const group = educationalGroups.find(g => g.ID === item.EducationalGroupID);
    
    const matchesGroup = selectedGroup === 'ทั้งหมด' || group?.Name === selectedGroup;
    const matchesSearch = 
      item.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    
    return matchesGroup && matchesSearch;
  });

  // Handle form submission
  const handleSubmit = () => {
    if (!formData.Title || !formData.EducationalGroupID || !formData.Description) {
      alert('กรุณากรอกข้อมูลที่จำเป็น (หัวข้อ, หมวดหมู่, และคำอธิบาย)');
      return;
    }
    
    if (editingItem) {
      setEducationalContents(items => 
        items.map(item => 
          item.ID === editingItem.ID 
            ? { ...formData, ID: editingItem.ID, UpdatedAt: new Date().toISOString().split('T')[0] }
            : item
        )
      );
      setEditingItem(null);
    } else {
      const newItem: EducationalContent = {
        ...formData,
        ID: Math.max(...educationalContents.map(i => i.ID || 0)) + 1,
        CreatedAt: new Date().toISOString().split('T')[0]
      };
      setEducationalContents(items => [...items, newItem]);
    }
    
    setFormData({
      Title: '',
      Picture: '',
      Link: '',
      Description: '',
      AdminID: currentAdmin.ID,
      EducationalGroupID: undefined
    });
    setShowAddForm(false);
  };

  // Handle edit
  const handleEdit = (item: EducationalContent) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบเนื้อหาการศึกษานี้?')) {
      setEducationalContents(items => items.filter(item => item.ID !== id));
    }
  };

  // Cancel form
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({
      Title: '',
      Picture: '',
      Link: '',
      Description: '',
      AdminID: currentAdmin.ID,
      EducationalGroupID: undefined
    });
  };

  const getGroupDisplayText = (groupId?: number) => {
    const group = educationalGroups.find(g => g.ID === groupId);
    return group?.Name || '';
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">จัดการข่าวสารและการให้ความรู้</h1>
              <p className="text-gray-600 mt-1">ระบบจัดการเนื้อหาการศึกษาและข้อมูลสุขภาพ</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">ผู้ดูแลระบบ</p>
              <p className="text-sm font-medium text-gray-900">{currentAdmin.Name}</p>
            </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  {educationalGroups.map(group => (
                    <option key={group.ID} value={group.Name}>{group.Name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="ค้นหาหัวข้อหรือเนื้อหา..."
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
                  เพิ่มเนื้อหาใหม่
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
                {editingItem ? '✏️ แก้ไขเนื้อหาการศึกษา' : '➕ เพิ่มเนื้อหาการศึกษาใหม่'}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      หัวข้อ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="ระบุหัวข้อเนื้อหา"
                      value={formData.Title || ''}
                      onChange={(e) => setFormData({...formData, Title: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      หมวดหมู่ <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={formData.EducationalGroupID || ''}
                      onChange={(e) => setFormData({...formData, EducationalGroupID: Number(e.target.value)})}
                    >
                      <option value="">เลือกหมวดหมู่</option>
                      {educationalGroups.map(group => (
                        <option key={group.ID} value={group.ID}>
                          {group.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL รูปภาพ</label>
                  <input
                    type="url"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com/image.jpg"
                    value={formData.Picture || ''}
                    onChange={(e) => setFormData({...formData, Picture: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ลิงก์เนื้อหา</label>
                  <input
                    type="url"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com/article"
                    value={formData.Link || ''}
                    onChange={(e) => setFormData({...formData, Link: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    คำอธิบาย <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="ระบุคำอธิบายเนื้อหา..."
                    value={formData.Description || ''}
                    onChange={(e) => setFormData({...formData, Description: e.target.value})}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    {editingItem ? 'บันทึกการแก้ไข' : 'เพิ่มเนื้อหา'}
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

        {/* Educational Contents List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">เนื้อหาการศึกษา ({filteredItems.length} รายการ)</h3>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">ไม่พบเนื้อหาการศึกษา</p>
              <p className="text-gray-400 text-sm">ลองเปลี่ยนเงื่อนไขการค้นหาหรือเพิ่มเนื้อหาใหม่</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <div key={item.ID} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-24 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                        {item.Picture ? (
                          <img 
                            src={item.Picture} 
                            alt={item.Title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.Title}</h4>
                          {item.Link && (
                            <a
                              href={item.Link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                              title="เปิดลิงก์"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            📚 {getGroupDisplayText(item.EducationalGroupID)}
                          </span>
                          {item.CreatedAt && (
                            <span className="text-sm text-gray-500">
                              📅 {new Date(item.CreatedAt).toLocaleDateString('th-TH')}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {item.Description}
                        </p>

                        {item.Link && (
                          <p className="text-xs text-blue-600 truncate">
                            🔗 {item.Link}
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

export default EducationalAdminPanel;