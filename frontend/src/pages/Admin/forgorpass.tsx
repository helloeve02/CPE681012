import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PasswordResetForm() {
    const [email, setEmail] = useState('focus001@gmail.com');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSend = () => {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        console.log('Resetting password with:', { email, newPassword });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 flex items-center justify-center p-4 font-kanit">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-lg rotate-12"></div>
                <div className="absolute top-40 right-20 w-12 h-12 bg-white/10 rounded-lg -rotate-12"></div>
                <div className="absolute bottom-32 left-16 w-20 h-20 bg-white/10 rounded-lg rotate-45"></div>
                <div className="absolute bottom-20 right-32 w-14 h-14 bg-white/10 rounded-lg -rotate-45"></div>
                <div className="absolute top-60 left-1/4 w-8 h-8 bg-white/10 rounded-lg rotate-12"></div>
                <div className="absolute top-80 right-1/3 w-10 h-10 bg-white/10 rounded-lg -rotate-12"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden relative z-10">
                {/* Left side with illustration */}
                <div className="flex-1 bg-gray-50 p-12 flex items-center justify-center relative">
                    <div className="relative">
                        {/* Main lock illustration */}
                        <div className="relative">
                            <div className="w-32 h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-xl relative">
                                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-300 rounded-full"></div>
                                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-16 border-4 border-blue-300 rounded-t-full bg-transparent"></div>
                                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-blue-200 rounded-sm"></div>
                            </div>

                            {/* Email envelope */}
                            <div className="absolute -right-8 top-12 w-16 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg shadow-lg transform rotate-12">
                                <div className="absolute top-2 left-2 w-12 h-8 bg-white rounded-sm opacity-90"></div>
                                <div className="absolute top-3 left-3 w-2 h-2 bg-red-400 rounded-full"></div>
                                <div className="absolute top-3 right-3 w-6 h-1 bg-gray-300 rounded-full"></div>
                                <div className="absolute top-5 right-3 w-4 h-1 bg-gray-300 rounded-full"></div>
                            </div>

                            {/* Pink card */}
                            <div className="absolute -left-12 bottom-4 w-20 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg shadow-lg transform -rotate-12">
                                <div className="absolute top-2 left-2 w-16 h-2 bg-pink-300 rounded-full"></div>
                                <div className="absolute top-5 left-2 w-12 h-2 bg-pink-300 rounded-full"></div>
                            </div>
                        </div>

                        {/* Floating decorative elements */}
                        <div className="absolute -top-8 -left-8 w-6 h-6 bg-purple-200 rounded-lg transform rotate-45"></div>
                        <div className="absolute -top-4 right-16 w-4 h-4 bg-blue-200 rounded-lg transform -rotate-12"></div>
                        <div className="absolute -bottom-6 -right-4 w-8 h-8 bg-purple-200 rounded-lg transform rotate-12"></div>
                        <div className="absolute bottom-16 -left-16 w-5 h-5 bg-pink-200 rounded-lg transform -rotate-45"></div>
                    </div>
                </div>

                {/* Right side with form */}
                <div className="flex-1 p-12">
                    <div className="max-w-sm mx-auto">
                        {/* Title and description */}
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Reset your Password</h2>

                        {/* Form */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 mt-8">Username</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                                        confirmPassword && newPassword !== confirmPassword 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-purple-500'
                                    }`}
                                    placeholder="Confirm your password"
                                />
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                                )}
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={!email || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-500 disabled:hover:to-purple-600"
                            >
                                Reset Password
                            </button>
                        </div>

                        {/* Back to Login link */}
                        <div className="text-center mt-8">
                            <button
                                type="button"
                                onClick={() => navigate("/admin")}
                                className="text-gray-500 hover:text-purple-500 transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}