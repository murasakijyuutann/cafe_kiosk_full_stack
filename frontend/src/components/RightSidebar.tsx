import styled from "styled-components";

const RightSidebar1 = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 260px;
  height: 100vh;
  background: white;
  border-left: 1px solid #ddd;
  padding: 1rem;
  
  z-index: 1000;
`;

const RightSidebar = () => {
  return (
    <>
    
      <RightSidebar1>
        <h3>고정바</h3>
        <p>여기에 알림, 장바구니, 메뉴 등 넣기</p>
      </RightSidebar1>
    </>
  );
};

export default RightSidebar;