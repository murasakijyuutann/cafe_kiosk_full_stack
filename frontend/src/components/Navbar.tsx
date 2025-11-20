import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff9c4; /* light yellow */
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 100;
`;
const MenuList = styled.ul`
  display: flex;
  gap: 24px;
  list-style: none;
  align-items: center;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #ffd54f; /* yellow hover */
    color: #000;
  }
`;

const Navbar = () => {
  return (
    <Menu>
      <NavLink to="/">Home</NavLink>
      <MenuList>
        <NavLink to="/menu"><li>Menu</li></NavLink>
        <NavLink to="/menu?category=커피"><li>Caffeine</li></NavLink>
        <NavLink to="/menu?category=논커피"><li>Non-Coffee</li></NavLink>
        <NavLink to="/menu?category=디저트"><li>Desert</li></NavLink>
      </MenuList>
      <NavLink to="/cart"><div>Cart</div></NavLink>
    </Menu>
  );
};

export default Navbar;
