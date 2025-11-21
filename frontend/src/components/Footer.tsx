
import styled from "styled-components";

const FooterContainer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 32px;
  background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  margin-top: auto;
  z-index: 100;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 1400px;
  width: 100%;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  color: #fff;
  letter-spacing: 0.3px;
  opacity: 0.95;

  &::before {
    content: '☕';
    margin-right: 8px;
    font-size: 1.1rem;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  letter-spacing: 0.3px;

  &:hover {
    color: #fff;
    transform: translateY(-2px);
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>&copy; 2025 明.鏡.止.水 Cafe Kiosk. All rights reserved.</FooterText>
        <FooterLinks>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Terms of Service</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;