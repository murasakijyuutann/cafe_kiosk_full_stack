// src/pages/TestMenu2.tsx
import { useEffect, useState } from "react";
import axios from "axios";

type Category = {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
  createdAt: string;
};

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  category: Category;
  createdAt: string;
  updatedAt: string;
};

const TestMenu2 = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // ✅ 백엔드 메뉴 주소를 직접 호출
        const res = await axios.get("http://localhost:8080/menu");

        console.log("✅ 실제 응답:", res.data);

        // 혹시 또 HTML이 오면 방어
        if (Array.isArray(res.data)) {
          setMenuItems(res.data);
        } else {
          console.error("❌ 배열이 아닙니다:", res.data);
          setError("메뉴 데이터 형식이 올바르지 않습니다.");
        }
      } catch (e) {
        console.error("❌ 메뉴 불러오기 실패:", e);
        setError("메뉴 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) return <div>불러오는 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>메뉴 테스트</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            [{item.category.name}] {item.name} - {item.price}원
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestMenu2;
