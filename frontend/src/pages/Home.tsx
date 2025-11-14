import styled from 'styled-components';

const Winter = styled.img`
  width: 100%;
  height: 100vh;
  object-fit: cover;
`;

const Home = () => {
  return (
    <>
      <Winter src="../public/images/winter.jpg" alt="winter" />;
    </>
  );
};

export default Home;
