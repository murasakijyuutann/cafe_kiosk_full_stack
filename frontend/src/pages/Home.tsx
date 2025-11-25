import styled from 'styled-components';

const Cafe = styled.img`
  width: 100%;
  height: 80vh;
  object-fit: cover;
`;

const Home = () => {
  return (
    <>
      <Cafe src="https://cafe-kiosk-images-mjyuu.s3.ap-northeast-2.amazonaws.com/cafe2.jpg" alt="cafe" />
    </>
  );
};

export default Home;
