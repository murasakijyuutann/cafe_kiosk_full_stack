// import { useState, FormEvent } from 'react';

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
      <div>Home</div>
      <MenuList>
        <li>Menu</li>
        <li>Caffeine</li>
        <li>Non-Coffee</li>
        <li>Desert</li>
      </MenuList>
      <div>Cart</div>
    </Menu>
  );
};

export default Navbar;
