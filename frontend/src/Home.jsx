import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

// Global style to reset margin and padding
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    overflow-x: hidden;
    font-family: 'Roboto', sans-serif;
  }
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  color: white;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #f8f8f8;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.6rem;
  font-weight: 300;
  line-height: 1.8;
  max-width: 600px;
  font-family: 'Open Sans', sans-serif;
  margin-bottom: 40px;
  color: #dddddd;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(45deg, #ff6b6b, #f94d6a);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.4);
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Home = () => {
  const navigate = useNavigate();

  const handleCameraNavigation = () => {
    navigate('/camera');
  };

  return (
    <>
      <GlobalStyle />
      <HomeContainer>
        <Title>Welcome</Title>
        <Description>
          Explore the platform and discover its features. Navigate easily and enjoy a sleek design experience.
        </Description>
        <Button onClick={handleCameraNavigation}>Go to Camera</Button>
      </HomeContainer>
    </>
  );
};

export default Home;
