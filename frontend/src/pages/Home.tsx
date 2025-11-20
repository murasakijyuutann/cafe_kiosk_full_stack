import styled from 'styled-components';

const Winter = styled.img`
  width: 100%;
  height: 80vh;
  object-fit: cover;
`;

const Home = () => {
  return (
    <>
      <Winter src="../public/images/cafe2.jpg" alt="winter" />
    </>
  );
};

export default Home;
