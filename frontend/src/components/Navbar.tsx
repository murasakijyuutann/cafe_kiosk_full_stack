// import { useState, FormEvent } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

// import { useNavigate, createSearchParams } from 'react-router-dom';
const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const MenuList = styled.ul`
  display: flex;
  gap: 20px;
  list-style: none; /* 점 없애기 */
  justify-content: space-between;
`;

const Navbar = () => {
  return (
    <Menu>
      <Link to="/">Home</Link>
      <MenuList>
        <Link to="/menu"><li>Menu</li></Link>
        <li>Caffeine</li>
        <li>Non-Coffee</li>
        <li>Desert</li>
      </MenuList>
      <Link to="/cart"><div>Cart</div></Link>
    </Menu>
  );
};

export default Navbar;
