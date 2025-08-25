import React, { useState } from 'react';
import { User, Lock, Key, Eye, EyeOff } from 'lucide-react';
import type { SignInInterface } from "../../interfaces/SignIn";
import { SignIn } from "../../services/https/index";
import { message } from "antd";
import { useNavigate } from 'react-router-dom';

export default function AdminLoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // <-- state ควบคุมการมองเห็น password
    const navigate = useNavigate();

    const onFinish = async (e: React.FormEvent) => {
        e.preventDefault();
        const values: SignInInterface = {
            UserName: username,
            Password: password
        };

        try {
            let res = await SignIn(values);
            console.log("API Response:", res);
            if (res.status === 200 || res.status === 204) {
                localStorage.setItem("isLogin", "true");
                message.success("Sign-in successful");
                setTimeout(() => {
                    navigate("/admin-home");
                }, 1500);
            } else {
                message.error(res.data?.error || "An error occurred during sign-in");
            }
        } catch (error) {
            message.error("Unable to connect to the server");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-white bg-blue-500 rounded-full py-2 px-4 text-sm font-medium inline-block mb-6">
                        ADMIN LOGIN
                    </h1>

                    {/* Icon */}
                    <div className="mb-6">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <div className="relative">
                                <User className="w-8 h-8 text-white" strokeWidth={2} />
                                <Key className="w-4 h-4 text-white absolute -right-1 -bottom-1" strokeWidth={2} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={onFinish} className="space-y-4">
                    {/* Username Field */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-100 rounded-full py-4 px-6 pr-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                            required
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <User className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>

                    {/* Password Field */}
                    {/* Password Field */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-100 rounded-full py-4 px-6 pr-16 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                            required
                        />

                        {/* Eye Button */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                        >
                            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>

                        {/* Lock Icon */}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Lock className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>



                    {/* Forgot Password */}
                    <div className="flex items-center justify-center pt-2">
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-pass")}
                            className="text-blue-500 text-sm hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-full font-medium text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            เข้าสู่ระบบ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
