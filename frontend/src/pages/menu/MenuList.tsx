import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllMenuItems, type MenuItem } from '../../api/cafekioskApi';
import { useCart } from '../../context/CartContext';

const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
`;

const MenuCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 0;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-4px);
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 12px 0 8px;
    padding: 0 12px;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: 1.2rem;
    font-weight: 800;
    color: #2d6a4f;
    margin: 0 0 16px;
    padding: 0 12px;
  }
`;

const MenuImg = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const AddToCartBadge = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: #2d6a4f;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3);
  transition: all 0.2s ease;

  ${MenuCard}:hover & {
    transform: scale(1.1);
    background: #1b4332;
  }
`;

const CardWrapper = styled.div`
  position: relative;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const CategoryButton = styled.button<{ selected: boolean }>`
  padding: 12px 24px;
  border-radius: 12px;
  border: 2px solid ${(props) => (props.selected ? '#2d6a4f' : '#e9ecef')};
  background: ${(props) => (props.selected ? '#2d6a4f' : '#fff')};
  color: ${(props) => (props.selected ? '#fff' : '#495057')};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.selected ? '#1b4332' : '#f8f9fa')};
    border-color: ${(props) => (props.selected ? '#1b4332' : '#2d6a4f')};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CategoryTitle = styled.h2`
  margin: 0 0 20px;
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a1a1a;
  padding-left: 8px;
  border-left: 4px solid #2d6a4f;
`;

const Toast = styled.div<{ show: boolean }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #2d6a4f;
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(45, 106, 79, 0.3);
  font-weight: 600;
  font-size: 0.95rem;
  transform: ${(props) => (props.show ? 'translateY(0)' : 'translateY(100px)')};
  opacity: ${(props) => (props.show ? '1' : '0')};
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '✓';
    font-size: 1.2rem;
  }
`;

const MenuList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | string>('ALL');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { addToCart } = useCart();

  const showAddedToast = (itemName: string) => {
    setToastMessage(`${itemName}이(가) 장바구니에 추가되었습니다`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleCategoryChange = (categoryName: string) => {
    if (categoryName === 'ALL') {
      navigate('/menu');
    } else {
      navigate(`/menu?category=${encodeURIComponent(categoryName)}`);
    }
  };

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
          <CategoryButton selected={selectedCategory === 'ALL'} onClick={() => handleCategoryChange('ALL')}>
            전체
          </CategoryButton>
          {categoryNames.map((categoryName) => (
            <CategoryButton
              key={categoryName}
              selected={selectedCategory === categoryName}
              onClick={() => handleCategoryChange(categoryName)}
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
                  <CardWrapper key={item.id}>
                    <MenuCard
                      onClick={() => {
                        addToCart(
                          {
                            id: item.id,
                            name: item.name,
                            price: item.price
                          },
                          1
                        );
                        showAddedToast(item.name);
                      }}
                    >
                      {item.imageUrl ? (
                        <MenuImg src={item.imageUrl} alt={item.name} />
                      ) : (
                        <MenuImg src="https://via.placeholder.com/300x180?text=No+Image" alt={item.name} />
                      )}
                      <h3>{item.name}</h3>
                      <p>₩{item.price.toLocaleString()}</p>
                      <AddToCartBadge>+</AddToCartBadge>
                    </MenuCard>
                  </CardWrapper>
                ))}
            </MenuGrid>
          </div>
        ))}
        <Toast show={showToast}>{toastMessage}</Toast>
      </Container>
    );
  } else {
    return (
      <Container>
        <CategoryTabs>
          <CategoryButton selected={selectedCategory === 'ALL'} onClick={() => handleCategoryChange('ALL')}>
            전체
          </CategoryButton>
          {categoryNames.map((categoryName) => (
            <CategoryButton
              key={categoryName}
              selected={selectedCategory === categoryName}
              onClick={() => handleCategoryChange(categoryName)}
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
              <CardWrapper key={item.id}>
                <MenuCard
                  onClick={() => {
                    addToCart(
                      {
                        id: item.id,
                        name: item.name,
                        price: item.price
                      },
                      1
                    );
                    showAddedToast(item.name);
                  }}
                >
                  {item.imageUrl ? (
                    <MenuImg src={item.imageUrl} alt={item.name} />
                  ) : (
                    <MenuImg src="https://via.placeholder.com/300x180?text=No+Image" alt={item.name} />
                  )}
                  <h3>{item.name}</h3>
                  <p>₩{item.price.toLocaleString()}</p>
                  <AddToCartBadge>+</AddToCartBadge>
                </MenuCard>
              </CardWrapper>
            ))}
        </MenuGrid>
        <Toast show={showToast}>{toastMessage}</Toast>
      </Container>
    );
  }
};

export default MenuList;
