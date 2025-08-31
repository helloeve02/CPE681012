import React, { useEffect, useState } from "react";
import { TopBarAdmin } from "../../components/TopBarAdmin";
import type { FoodItemInterface } from "../../interfaces/FoodItem";
import { ListUsers, CreateUser, DeleteUserByID } from "../../services/https";
import { Button, Form, Input, message, Modal, Card, Space, Typography, Avatar, Row, Col, Divider } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import type { AdminInterface } from "../../interfaces/Admin";

const { Title, Text } = Typography;

const FoodAdminPanel: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [foodItems, setFoodItems] = useState<AdminInterface[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminInterface | null>(null);
  const [form] = Form.useForm();

  const fetchFoodItems = async () => {
    try {
      const res = await ListUsers();
      if (res?.data) {
        setFoodItems(res.data);
      }
    } catch (err) {
      messageApi.error("โหลดข้อมูลล้มเหลว");
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleSubmit = async (values: AdminInterface) => {
    try {
      if (editingItem) {
        // update mode (mock)
        setFoodItems((prev) =>
          prev.map((f) => (f.ID === editingItem.ID ? { ...values, ID: editingItem.ID } : f))
        );
        messageApi.success("แก้ไขสำเร็จ");
      } else {
        // create mode
        const res = await CreateUser(values);
        if (res?.status === 201) {
          setFoodItems((prev) => [...prev, res.data]);
          messageApi.success("เพิ่มข้อมูลสำเร็จ");
        }
      }
      setShowAddForm(false);
      form.resetFields();
      setEditingItem(null);
    } catch (err) {
      messageApi.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "คุณแน่ใจหรือไม่ที่จะลบรายการนี้?",
      okText: "ลบ",
      cancelText: "ยกเลิก",
      okType: "danger",
      onOk: async () => {
        try {
          const res = await DeleteUserByID(id);
          if (res?.status === 200) {
            setFoodItems((prev) => prev.filter((f) => f.ID !== id));
            messageApi.success("ลบสำเร็จ");
          }
        } catch {
          messageApi.error("ไม่สามารถลบได้");
        }
      },
    });
  };

  const openAddForm = () => {
    setEditingItem(null);
    form.resetFields();
    setShowAddForm(true);
  };

  const openEditForm = (item: FoodItemInterface) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    form.resetFields();
  };

  return (
    // <div className="font-kanit">
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 font-kanit">
      {contextHolder}
      <TopBarAdmin />

      <div className="max-w-7xl mx-auto p-6 ">
        {/* Header Section */}
        <div className="mb-8 ">
          <div className="text-center mb-6 ">
            <Title level={1} className="!mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              ระบบจัดการแอดมิน
            </Title>
            <Text type="secondary" className="text-lg">
              จัดการข้อมูลผู้ดูแลระบบอย่างมีประสิทธิภาพ
            </Text>
          </div>
        </div>

        {/* Stats Section */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="black-blue-100 text-sm font-medium">จำนวนแอดมินทั้งหมด</Text>
                  <div className="text-3xl font-bold black-white mt-2">{foodItems.length}</div>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <UserOutlined className="text-black text-2xl" />
                </div>
              </div>
            </Card>
          </Col>
          
          
        </Row>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8 border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UserOutlined className="text-white text-lg" />
                </div>
                <Title level={3} className="!text-white !mb-0">
                  {editingItem ? "แก้ไขข้อมูลแอดมิน" : "เพิ่มแอดมินใหม่"}
                </Title>
              </div>
              <Button 
                type="text" 
                icon={<CloseOutlined />} 
                onClick={cancelForm}
                className="text-white hover:bg-white/20 border-white/30"
              />
            </div>
            
            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ FirstName: "", LastName: "", Password: "", UserName: "" }}
                className="max-w-4xl mx-auto"
              >
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="font-semibold text-gray-700 text-base">ชื่อ</span>}
                      name="FirstName"
                      rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
                    >
                      <Input 
                        size="large"
                        placeholder="กรอกชื่อจริง"
                        className="rounded-xl border-2 border-blue-200 hover:border-blue-400 focus:border-blue-500 shadow-sm"
                        prefix={<UserOutlined className="text-blue-400" />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="font-semibold text-gray-700 text-base">นามสกุล</span>}
                      name="LastName"
                      rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
                    >
                      <Input 
                        size="large"
                        placeholder="กรอกนามสกุล"
                        className="rounded-xl border-2 border-blue-200 hover:border-blue-400 focus:border-blue-500 shadow-sm"
                        prefix={<UserOutlined className="text-blue-400" />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="font-semibold text-gray-700 text-base">ชื่อผู้ใช้</span>}
                      name="UserName"
                      rules={[{ required: true, message: "กรุณากรอก Username" }]}
                    >
                      <Input 
                        size="large"
                        placeholder="กรอก Username"
                        className="rounded-xl border-2 border-blue-200 hover:border-blue-400 focus:border-blue-500 shadow-sm"
                        prefix={<span className="text-blue-400">@</span>}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="font-semibold text-gray-700 text-base">รหัสผ่าน</span>}
                      name="Password"
                      rules={[{ required: true, message: "กรุณากรอก Password" }]}
                    >
                      <Input.Password 
                        size="large"
                        placeholder="กรอกรหัสผ่าน"
                        className="rounded-xl border-2 border-blue-200 hover:border-blue-400 focus:border-blue-500 shadow-sm"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider className="my-8" />

                <div className="flex justify-center space-x-4">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large"
                    icon={<SaveOutlined />}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-none shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 rounded-xl px-8 h-12 font-semibold"
                  >
                    {editingItem ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}
                  </Button>
                  <Button 
                    size="large"
                    onClick={cancelForm}
                    className="rounded-xl border-2 border-gray-300 hover:border-gray-400 px-8 h-12 font-semibold"
                  >
                    ยกเลิก
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        )}

        {/* Action Button */}
        {!showAddForm && (
          <div className="text-center mb-8">
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />} 
              onClick={openAddForm}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-none shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 rounded-xl px-8 h-12 font-semibold"
            >
              เพิ่มแอดมินใหม่
            </Button>
          </div>
        )}

        {/* Admin List */}
        <Card 
          className="border-0 shadow-xl rounded-2xl overflow-hidden "
          bodyStyle={{ padding: 0 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <UserOutlined className="text-white text-lg" />
              </div>
              <Title level={3} className="!text-white !mb-0">รายการแอดมินในระบบ</Title>
            </div>
          </div>
          
          <div className="p-8 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 min-h-96 ">
            {foodItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <UserOutlined className="text-6xl text-blue-400" />
                </div>
                <Title level={3} className="text-gray-500 mb-4 ">ยังไม่มีข้อมูลแอดมิน</Title>
                <Text type="secondary" className="text-lg mb-6 block">
                  เริ่มต้นโดยการเพิ่มแอดมินคนแรกเข้าสู่ระบบ
                </Text>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={openAddForm}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-none shadow-lg rounded-xl px-8 h-12"
                >
                  เพิ่มแอดมินคนแรก
                </Button>
              </div>
            ) : (
              <Row gutter={[24, 24]}>
                {foodItems.map((item) => (
                  <Col key={item.ID} xs={24} sm={12} lg={8} xl={6}>
                    <Card
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm"
                      bodyStyle={{ padding: 0 }}
                    >
                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-center relative">
                        <Avatar
                          size={64}
                          icon={<UserOutlined />}
                          className="bg-white text-blue-500 shadow-lg border-4 border-white"
                        />
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 text-center font-kanit">
                        <Title level={4} className="!mb-2 text-gray-800">
                          {item.FirstName} {item.LastName}
                        </Title>
                        <Text className="text-blue-600 font-semibold block mb-1">@{item.UserName}</Text>
                        <Text type="secondary" className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full inline-block">
                          ID: {item.ID}
                        </Text>
                        
                        <Divider className="my-4" />
                        
                        <Space size="small" className="w-full justify-center">
                          <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => message.info(`รายละเอียด: ${item.FirstName} ${item.LastName}`)}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg"
                            size="large"
                          />
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openEditForm(item)}
                            className="hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 rounded-lg"
                            size="large"
                          />
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(item.ID!)}
                            className="hover:bg-red-50 transition-all duration-200 rounded-lg"
                            size="large"
                          />
                        </Space>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Card>
      </div>
    </div>
    // </div>
  );
};

export default FoodAdminPanel;