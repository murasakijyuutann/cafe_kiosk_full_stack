import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { fetchMenuItems } from './MenuItem';
import type { MenuItemType } from './MenuItem';

const Container = styled.div`
  padding: 20px;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
`;

const MenuCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const MenuImg = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
`;

const MenuList = () => {
  const [menus, setMenus] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMenuItems(); // now uses shared fetch logic
        setMenus(data);
      } catch (e) {
        console.error(e);
        setError('Failed to load menu items.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Container>Loading menu...</Container>;
  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <MenuGrid>
        {menus.map((item) => (
          <MenuCard key={item.id}>
            <MenuImg src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.price.toLocaleString()}원</p>
          </MenuCard>
        ))}
      </MenuGrid>
    </Container>
  );
};

export default MenuList;
