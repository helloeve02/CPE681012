import React from "react";
import { TopBarAdmin } from "../../components/TopBarAdmin"
import type { AdminInterface } from "../../interfaces/Admin";
import { CreateUser } from "../../services/https/index";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: AdminInterface) => {
    try {
      const res = await CreateUser(values);

      if (res.status === 201) {
        messageApi.open({
          type: "success",
          content: res.data.message,
        });

        setTimeout(() => {
          navigate("/admin-home");
        }, 1000);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "An error occurred during signup. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-blue-200 font-kanit">
      {contextHolder}
      <TopBarAdmin />
      
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Decorative */}
          <div className="hidden lg:flex flex-col justify-center items-center p-8">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/50 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                    เข้าร่วมกับเรา
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                    สร้างบัญชีผู้ดูแลระบบของคุณและเริ่มจัดการแพลตฟอร์มด้วยเครื่องมือที่ทรงพลังและอินเตอร์เฟซที่ใช้งานง่าย
                  </p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-sky-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-200/30">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-cyan-700 bg-clip-text text-transparent mb-2">
                  สมัครสมาชิก
                </h2>
                <p className="text-blue-600">สร้างบัญชีผู้ดูแลระบบ</p>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-4"></div>
              </div>

              <Form
                name="signup-form"
                onFinish={onFinish}
                layout="vertical"
                className="space-y-2"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="FirstName"
                    label={<span className="text-blue-700 font-medium">ชื่อ</span>}
                    rules={[
                      { required: true, message: "กรุณากรอกชื่อ" },
                    ]}
                    className="mb-4"
                  >
                    <Input 
                      placeholder="ชื่อ" 
                      className="h-12 rounded-xl border-blue-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="LastName"
                    label={<span className="text-blue-700 font-medium">นามสกุล</span>}
                    rules={[
                      { required: true, message: "กรุณากรอกนามสกุล" },
                    ]}
                    className="mb-4"
                  >
                    <Input 
                      placeholder="นามสกุล" 
                      className="h-12 rounded-xl border-blue-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  name="UserName"
                  label={<span className="text-blue-700 font-medium">ชื่อผู้ใช้</span>}
                  rules={[
                    { required: true, message: "กรุณากรอกชื่อผู้ใช้" },
                  ]}
                  className="mb-4"
                >
                  <Input 
                    placeholder="ชื่อผู้ใช้" 
                    className="h-12 rounded-xl border-blue-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    prefix={
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="Password"
                  label={<span className="text-blue-700 font-medium">รหัสผ่าน</span>}
                  rules={[
                    { required: true, message: "กรุณากรอกรหัสผ่าน" },
                  ]}
                  className="mb-6"
                >
                  <Input.Password 
                    placeholder="รหัสผ่าน" 
                    className="h-12 rounded-xl border-blue-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    prefix={
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button 
                    htmlType="submit" 
                    block
                    className="h-12 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 border-0 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 hover:from-blue-600 hover:to-cyan-700 "
                  >
                    <span className="flex items-center justify-center space-x-2 font-kanit y-5">
                      <span>สมัครสมาชิก</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                </Form.Item>
              </Form>

              {/* Footer */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;