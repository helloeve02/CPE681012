import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetMenuById } from "../../services/https/index"; 

const FoodDetail = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);
  if (!id) return <p>ไม่พบ ID</p>;
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await GetMenuById(id);
        setMenu(res.data);
        console.log(res.data)
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, [id]);

  if (!menu) return <p>Loading...</p>;

  return (
    <></>
  );
};

export default FoodDetail;
