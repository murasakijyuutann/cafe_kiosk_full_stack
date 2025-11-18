import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllMenuItems, type MenuItem } from '../../api/cafekioskApi';

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

const CategoryTabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const CategoryButton = styled.button<{ selected: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${(props) => (props.selected ? '#000' : '#eee')};
  color: ${(props) => (props.selected ? '#fff' : '#000')};
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: #000;
    color: #fff;
  }
`;

const CategoryTitle = styled.h2`
  margin: 20px 0 12px;
`;

const MenuList = () => {
  const location = useLocation();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | string>('ALL');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllMenuItems(); // now uses shared fetch logic
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromQuery = params.get('category');
    if (categoryFromQuery) {
      setSelectedCategory(categoryFromQuery);
    } else {
      setSelectedCategory('ALL');
    }
  }, [location.search]);

  if (loading) return <Container>Loading menu...</Container>;
  if (error) return <Container>{error}</Container>;

  const categoryNames = Array.from(
    new Set(menus.map((item) => item.category?.name).filter((name): name is string => !!name))
  );

  if (selectedCategory === 'ALL') {
    return (
      <Container>
        <CategoryTabs>
          <CategoryButton selected={selectedCategory === 'ALL'} onClick={() => setSelectedCategory('ALL')}>
            전체
          </CategoryButton>
          {categoryNames.map((categoryName) => (
            <CategoryButton
              key={categoryName}
              selected={selectedCategory === categoryName}
              onClick={() => setSelectedCategory(categoryName)}
            >
              {categoryName}
            </CategoryButton>
          ))}
        </CategoryTabs>
        {categoryNames.map((categoryName) => (
          <div key={categoryName}>
            <CategoryTitle>{categoryName}</CategoryTitle>
            <MenuGrid>
              {menus
                .filter((item) => item.category?.name === categoryName)
                .map((item) => (
                  <MenuCard key={item.id}>
                    {item.imageUrl && <MenuImg src={item.imageUrl} alt={item.name} />}
                    <h3>{item.name}</h3>
                    <p>{item.price.toLocaleString()}원</p>
                  </MenuCard>
                ))}
            </MenuGrid>
          </div>
        ))}
      </Container>
    );
  } else {
    return (
      <Container>
        <CategoryTabs>
          <CategoryButton selected={selectedCategory === 'ALL'} onClick={() => setSelectedCategory('ALL')}>
            전체
          </CategoryButton>
          {categoryNames.map((categoryName) => (
            <CategoryButton
              key={categoryName}
              selected={selectedCategory === categoryName}
              onClick={() => setSelectedCategory(categoryName)}
            >
              {categoryName}
            </CategoryButton>
          ))}
        </CategoryTabs>
        <CategoryTitle>{selectedCategory}</CategoryTitle>
        <MenuGrid>
          {menus
            .filter((item) => item.category?.name === selectedCategory)
            .map((item) => (
              <MenuCard key={item.id}>
                {item.imageUrl && <MenuImg src={item.imageUrl} alt={item.name} />}
                <h3>{item.name}</h3>
                <p>{item.price.toLocaleString()}원</p>
              </MenuCard>
            ))}
        </MenuGrid>
      </Container>
    );
  }
};

export default MenuList;
