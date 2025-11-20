// import axios from 'axios';

// Type definition for one menu item
export interface MenuItemType {
  id: number;
  name: string;
  price: number;
  img: string;
}

// 1) Temporary mock data (before connecting to DB)
//    You can freely add/edit items here.
export const menuItem: MenuItemType[] = [
  {
    id: 1,
    name: 'Americano',
    price: 4500,
    img: '/images/coffee/americano.jpg',
  },
  {
    id: 2,
    name: 'Cafe Latte',
    price: 5000,
    img: '/images/coffee/latte.jpg',
  },
  {
    id: 3,
    name: 'Vanilla Latte',
    price: 5500,
    img: '/images/coffee/vanilla_latte.jpg',
  },
  {
    id: 4,
    name: 'Decaf Americano',
    price: 4800,
    img: '/images/coffee/decaf_americano.jpg',
  },
];

// 2) Unified fetch function
//    - For now: just returns mock data
//    - Later: uncomment axios 부분만 바꾸면 DB 연동으로 전환 가능
export const fetchMenuItems = async (): Promise<MenuItemType[]> => {
  // ✅ STEP 1: Before DB
  // return menuItem;

  // ✅ STEP 2: After connecting to DB (example)
  // const res = await axios.get<MenuItemType[]>('/api/menu-items');
  // return res.data;

  // 현재는 목데이터를 쓰도록
  return menuItem;
};
