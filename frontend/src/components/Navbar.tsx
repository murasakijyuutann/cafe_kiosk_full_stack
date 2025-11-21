import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Menu = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Brand = styled(Link)`
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: scale(1.05);
    color: #d4f1e8;
  }

  &::before {
    content: '☕';
    font-size: 1.8rem;
  }
`;

const MenuList = styled.ul`
  display: flex;
  gap: 8px;
  list-style: none;
  align-items: center;
  margin: 0;
  padding: 0;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  letter-spacing: 0.3px;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  li, div {
    margin: 0;
    padding: 0;
  }
`;

const CartLink = styled(NavLink)`
  background: rgba(255, 255, 255, 0.2);
  font-weight: 700;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &::before {
    content: '🛒';
    margin-right: 6px;
    font-size: 1.2rem;
  }
`;

const Navbar = () => {
  return (
    <Menu>
      <Brand to="/">Cafe Kiosk</Brand>
      <MenuList>
        <NavLink to="/menu"><li>Menu</li></NavLink>
        {/* <NavLink to="/menu?category=커피"><li>Caffeine</li></NavLink>
        <NavLink to="/menu?category=논커피"><li>Non-Coffee</li></NavLink>
        <NavLink to="/menu?category=디저트"><li>Desert</li></NavLink> */}
      </MenuList>
      <CartLink to="/cart"><div>Cart</div></CartLink>
    </Menu>
  );
};

export default Navbar;
