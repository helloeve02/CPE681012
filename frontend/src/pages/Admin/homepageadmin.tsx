import React from 'react';
import { Link } from 'react-router-dom';


export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md border-b-2 border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">ยินดีต้อนรับ</span>
                        <span className="text-gray-800 font-medium text-lg">admin</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-sm mx-auto space-y-3 pt-8 p-4">

                {/* Menu Item 1 - ข้าวสารและการใช้ความรู้ */}
                <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-gray-200">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center relative">
                            {/* Icon */}
                            <div className="w-12 h-14 bg-white border-2 border-gray-300 rounded-sm relative">
                                <div className="w-full h-3 bg-red-400 rounded-t-sm"></div>
                                <div className="p-1">
                                    <div className="w-full h-1 bg-blue-400 mb-1 rounded"></div>
                                    <div className="w-3/4 h-1 bg-gray-300 mb-1 rounded"></div>
                                    <div className="w-full h-1 bg-gray-300 mb-1 rounded"></div>
                                    <div className="w-2/3 h-1 bg-gray-300 rounded"></div>
                                </div>
                                {/* Symbols */}
                                <div className="absolute -top-1 -left-1 text-xs text-gray-400">×</div>
                                <div className="absolute -top-1 -right-1 text-xs text-gray-400">+</div>
                                <div className="absolute -bottom-1 -left-1 text-xs text-gray-400">√</div>
                                <div className="absolute top-2 -right-2 text-red-500 text-sm">+</div>
                            </div>
                        </div>
                        <Link to="/admin/educational" className="text-gray-800 font-medium text-base flex-1 cursor-pointer">
                            จัดการข่าวสารและการใช้ความรู้
                        </Link>
                    </div>

                </div>

                {/* Menu Item 2 - เมนูอาหารแนะนำ (Active) */}
                <div className="bg-blue-50 rounded-3xl p-6 shadow-md border-2 border-blue-300">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center relative shadow-sm">
                            {/* Clipboard with apple */}
                            <div className="w-10 h-12 bg-white border-2 border-gray-300 rounded-sm relative">
                                <div className="w-6 h-2 bg-gray-300 rounded-full mx-auto mt-1"></div>
                                <div className="p-1 mt-1">
                                    <div className="w-full h-1 bg-blue-400 mb-1 rounded"></div>
                                    <div className="w-3/4 h-1 bg-orange-400 mb-1 rounded"></div>
                                    <div className="w-full h-1 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                            {/* Red apple */}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full">
                                <div className="w-1 h-2 bg-green-600 rounded-full mx-auto -mt-1"></div>
                            </div>
                        </div>
                        <Link to="/admin/menu" className="text-gray-800 font-medium text-base flex-1">
                            จัดการเมนูอาหารแนะนำ
                        </Link>
                    </div>
                </div>

                {/* Menu Item 4 - เพิ่มรายการอาหารและแบบฟ */}
                <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-gray-200">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center relative">
                            {/* Document with medical cross and magnifying glass */}
                            <div className="w-10 h-12 bg-white border-2 border-gray-300 rounded-sm relative">
                                <div className="absolute top-1 left-1 w-2 h-2">
                                    <div className="w-full h-0.5 bg-red-500 absolute top-1"></div>
                                    <div className="h-full w-0.5 bg-red-500 absolute left-1"></div>
                                </div>
                                <div className="p-1 mt-3">
                                    <div className="w-full h-1 bg-gray-300 mb-1 rounded"></div>
                                    <div className="w-3/4 h-1 bg-gray-300 mb-1 rounded"></div>
                                    <div className="w-full h-1 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                            {/* Magnifying glass */}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-blue-600">
                                <div className="absolute -bottom-1 -right-1 w-2 h-0.5 bg-orange-400 rounded-full transform rotate-45"></div>
                                <div className="absolute top-1 left-1 w-1.5 h-1.5 border border-white rounded-full"></div>
                            </div>
                        </div>
                        <Link to="/admin/fooditem" className="text-gray-800 font-medium text-base flex-1">
                            จัดการรายการอาหารและวัตถุดิบ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}