import type { MenuInterface } from "../interfaces/Menu";
import { GetAllMenu } from "../services/https";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Alert } from "antd";

const Menu: React.FC = () => {
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [error, setError] = useState("");

  const getAllMenu = async () => {
    try {
      const res = await GetAllMenu();
      if (Array.isArray(res?.data?.menu)) {
        setMenu(res.data.menu);
      } else {
        setError("Failed to load menu items");
      }
    } catch (error) {
      setError("Error fetching menu items. Please try again later.");
    }
  };

  useEffect(() => {
    getAllMenu();
  }, []);

  return (
    
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
       <div className="w-[10cm] h-[10px] bg-blue-500 mb-4">Menu List</div>
       <div className="bg-red-500 text-white p-4">ทดสอบ</div>

        {error && <Alert message={error} type="error" showIcon className="mb-4" />}

        <Row gutter={[16,20]}>
          {menu.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.ID}>
              <Card title={`${item.Title || "No Title"}`} bordered={true}>
                {/* คุณสามารถเพิ่มคำอธิบายหรือรูปได้ที่นี่ ,,b*/}
                {/* <p>{item.Description || "No Description"}</p> */}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Menu;
