

import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #fff9c4;
  color: black;              /* text-white */
  text-align: center;          /* text-center */
  padding: 1rem 0;             /* py-3 */
  margin-top: auto;            /* mt-auto (flex 컨테이너 안에서 아래로 밀기) */
`;

const FooterText = styled.p`
  margin-bottom: 0;            /* mb-0 */
  font-size: 0.9rem;
  text-align: left;
  opacity: 0.9;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>&copy; 明.鏡.止.水 2025 Cafe Kiosk. All rights reserved.</FooterText>
    </FooterContainer>
  );
};

export default Footer;