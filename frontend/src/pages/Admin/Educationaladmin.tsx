import React, { useState, useRef } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, Filter, ExternalLink, BookOpen, Eye } from 'lucide-react';

// Updated interfaces matching Go entities
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

interface ContentCategory {
  ID?: number;
  Category?: string;
}

interface EducationalContent {
  ID?: number;
  Title?: string;
  PictureIn?: string;
  PictureOut?: string;
  Link?: string;
  Description?: string;
  Credit?: string;
  AdminID?: number;
  Admin?: Admin;
  EducationalGroupID?: number;
  EducationalGroup?: EducationalGroup;
  ContentCategoryID?: number;
  ContentCategory?: ContentCategory;
  CreatedAt?: string;
  UpdatedAt?: string;
}

const EducationalAdminPanel = () => {
  // Sample data for demo
  const [educationalGroups] = useState<EducationalGroup[]>([
    { ID: 1, Name: 'โภชนาการและอาหาร' },
    { ID: 2, Name: 'การออกกำลังกาย' },
    { ID: 3, Name: 'สุขภาพจิต' },
    { ID: 4, Name: 'การดูแลตนเอง' }
  ]);

  const [contentCategories] = useState<ContentCategory[]>([
    { ID: 1, Category: 'บทความ' },
    { ID: 2, Category: 'วิดีโอ' },
    { ID: 3, Category: 'อินโฟกราฟิก' },
    { ID: 4, Category: 'คู่มือ' },
    { ID: 5, Category: 'เคล็ดลับ' }
  ]);

  // Get current admin - using fallback instead of localStorage
  const getCurrentAdmin = (): Admin => {
    return { ID: 1, Name: 'ผู้ดูแลระบบ', Email: 'admin@example.com' };
  };

  const [currentAdmin] = useState<Admin>(getCurrentAdmin());

  const [educationalContents, setEducationalContents] = useState<EducationalContent[]>([
    {
      ID: 1,
      Title: '5 อาหารที่ช่วยลดความดันโลหิต',
      PictureIn: '/api/placeholder/300/200',
      PictureOut: '/api/placeholder/300/200',
      Link: 'https://example.com/article-1',
      Description: 'แนะนำอาหารที่มีสารอาหารสำคัญที่ช่วยในการควบคุมความดันโลหิตให้อยู่ในเกณฑ์ปกติ พร้อมคำแนะนำในการปรุงอาหารที่ถูกต้อง',
      Credit: 'สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)',
      AdminID: 1,
      EducationalGroupID: 1,
      ContentCategoryID: 1,
      CreatedAt: '2024-01-15'
    },
    {
      ID: 2,
      Title: 'การออกกำลังกายเบาๆ สำหรับผู้สูงอายุ',
      PictureIn: '/api/placeholder/300/200',
      PictureOut: '/api/placeholder/300/200',
      Link: 'https://example.com/article-2',
      Description: 'ท่าออกกำลังกายง่ายๆ ที่เหมาะสำหรับผู้สูงอายุและผู้ที่มีข้อจำกัดในการเคลื่อนไหว เพื่อสร้างความแข็งแรงให้กับร่างกาย',
      Credit: 'กรมอนามัย กระทรวงสาธารณสุข',
      AdminID: 1,
      EducationalGroupID: 2,
      ContentCategoryID: 2,
      CreatedAt: '2024-01-20'
    },
    {
      ID: 3,
      Title: 'เทคนิคการจัดการความเครียด',
      PictureIn: '/api/placeholder/300/200',
      PictureOut: '/api/placeholder/300/200',
      Link: 'https://example.com/article-3',
      Description: 'วิธีการจัดการกับความเครียดในชีวิตประจำวัน ด้วยเทคนิคง่ายๆ ที่สามารถทำได้ที่บ้าน รวมถึงการหายใจและการผ่อนคลาย',
      Credit: 'สมาคมจิตแพทย์แห่งประเทศไทย',
      AdminID: 1,
      EducationalGroupID: 3,
      ContentCategoryID: 3,
      CreatedAt: '2024-01-25'
    }
  ]);

  // State management
  const [selectedGroup, setSelectedGroup] = useState<string>('ทั้งหมด');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<EducationalContent | null>(null);
  const [viewingItem, setViewingItem] = useState<EducationalContent | null>(null);

  // Ref for form section
  const formRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState<EducationalContent>({
    Title: '',
    PictureIn: '',
    PictureOut: '',
    Link: '',
    Description: '',
    Credit: '',
    AdminID: currentAdmin.ID,
    EducationalGroupID: undefined,
    ContentCategoryID: undefined
  });

  // Filter educational contents
  const filteredItems = educationalContents.filter(item => {
    const group = educationalGroups.find(g => g.ID === item.EducationalGroupID);
    const category = contentCategories.find(c => c.ID === item.ContentCategoryID);
    
    const matchesGroup = selectedGroup === 'ทั้งหมด' || group?.Name === selectedGroup;
    const matchesCategory = selectedCategory === 'ทั้งหมด' || category?.Category === selectedCategory;
    const matchesSearch = 
      item.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    
    return matchesGroup && matchesCategory && matchesSearch;
  });

  // Handle form submission
  const handleSubmit = () => {
    if (!formData.Title || !formData.EducationalGroupID || !formData.ContentCategoryID || !formData.Description) {
      alert('กรุณากรอกข้อมูลที่จำเป็น (หัวข้อ, หมวดหมู่, ประเภทเนื้อหา และคำอธิบาย)');
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
      PictureIn: '',
      PictureOut: '',
      Link: '',
      Description: '',
      Credit: '',
      AdminID: currentAdmin.ID,
      EducationalGroupID: undefined,
      ContentCategoryID: undefined
    });
    setShowAddForm(false);
  };

  const handleEdit = (item: EducationalContent) => {
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

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingItem(null);
    setFormData({
      Title: '',
      PictureIn: '',
      PictureOut: '',
      Link: '',
      Description: '',
      Credit: '',
      AdminID: currentAdmin.ID,
      EducationalGroupID: undefined,
      ContentCategoryID: undefined
    });
    
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

  const handleViewDetails = (item: EducationalContent) => {
    setViewingItem(item);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบเนื้อหาการศึกษานี้?')) {
      setEducationalContents(items => items.filter(item => item.ID !== id));
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({
      Title: '',
      PictureIn: '',
      PictureOut: '',
      Link: '',
      Description: '',
      Credit: '',
      AdminID: currentAdmin.ID,
      EducationalGroupID: undefined,
      ContentCategoryID: undefined
    });
  };

  const getGroupDisplayText = (groupId?: number) => {
    const group = educationalGroups.find(g => g.ID === groupId);
    return group?.Name || '';
  };

  const getCategoryDisplayText = (categoryId?: number) => {
    const category = contentCategories.find(c => c.ID === categoryId);
    return category?.Category || '';
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
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทเนื้อหา</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  {contentCategories.map(category => (
                    <option key={category.ID} value={category.Category}>{category.Category}</option>
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
                  onClick={handleAddNew}
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
          <div ref={formRef} className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 scroll-mt-8">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประเภทเนื้อหา <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.ContentCategoryID || ''}
                    onChange={(e) => setFormData({...formData, ContentCategoryID: Number(e.target.value)})}
                  >
                    <option value="">เลือกประเภทเนื้อหา</option>
                    {contentCategories.map(category => (
                      <option key={category.ID} value={category.ID}>
                        {category.Category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL รูปภาพหน้าปก</label>
                    <input
                      type="url"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://example.com/cover-image.jpg"
                      value={formData.PictureIn || ''}
                      onChange={(e) => setFormData({...formData, PictureIn: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL รูปภาพเนื้อหา</label>
                    <input
                      type="url"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://example.com/content-image.jpg"
                      value={formData.PictureOut || ''}
                      onChange={(e) => setFormData({...formData, PictureOut: e.target.value})}
                    />
                  </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">เครดิต/แหล่งที่มา</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="ระบุแหล่งที่มาหรือเครดิต"
                    value={formData.Credit || ''}
                    onChange={(e) => setFormData({...formData, Credit: e.target.value})}
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
                        {item.PictureIn ? (
                          <img 
                            src={item.PictureIn} 
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
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            📝 {getCategoryDisplayText(item.ContentCategoryID)}
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

                        {item.Credit && (
                          <p className="text-xs text-gray-500 mb-1">
                            ✏️ เครดิต: {item.Credit}
                          </p>
                        )}

                        {item.Link && (
                          <p className="text-xs text-blue-600 truncate">
                            🔗 {item.Link}
                          </p>
                        )}
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
                <h3 className="text-xl font-semibold text-gray-900">รายละเอียดเนื้อหาการศึกษา</h3>
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
                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพหน้าปก</label>
                    <div className="w-full h-32 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                      {viewingItem.PictureIn ? (
                        <img 
                          src={viewingItem.PictureIn} 
                          alt="Cover Image"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <BookOpen className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพเนื้อหา</label>
                    <div className="w-full h-32 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                      {viewingItem.PictureOut ? (
                        <img 
                          src={viewingItem.PictureOut} 
                          alt="Content Image"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <BookOpen className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อ</label>
                    <p className="text-lg font-semibold text-gray-900">{viewingItem.Title}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        📚 {getGroupDisplayText(viewingItem.EducationalGroupID)}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทเนื้อหา</label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        📝 {getCategoryDisplayText(viewingItem.ContentCategoryID)}
                      </span>
                    </div>

                    {viewingItem.CreatedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สร้าง</label>
                        <p className="text-gray-700">
                          📅 {new Date(viewingItem.CreatedAt).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                    )}
                  </div>

                  {viewingItem.Description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">{viewingItem.Description}</p>
                      </div>
                    </div>
                  )}

                  {viewingItem.Credit && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เครดิต/แหล่งที่มา</label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-700">{viewingItem.Credit}</p>
                      </div>
                    </div>
                  )}

                  {viewingItem.Link && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ลิงก์เนื้อหา</label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <a 
                          href={viewingItem.Link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
                        >
                          {viewingItem.Link}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingItem.PictureIn && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพหน้าปก</label>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600 break-all">{viewingItem.PictureIn}</p>
                        </div>
                      </div>
                    )}

                    {viewingItem.PictureOut && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพเนื้อหา</label>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600 break-all">{viewingItem.PictureOut}</p>
                        </div>
                      </div>
                    )}
                  </div>
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
                    แก้ไขเนื้อหา
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

export default EducationalAdminPanel;