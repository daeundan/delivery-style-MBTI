import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import FoodBg from "../image/foodbg.jpg";
import FoodBg2 from "../image/foodbg2.jpg";
import Loading from "./Lodading";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${({ $isSmallScreen }) => ($isSmallScreen ? "86vh" : "100vh")};
  width: 100%;
  color: #1e1e1e;
  background: ${({ $isSmallScreen }) =>
    $isSmallScreen
      ? "transparent"
      : `url(${FoodBg2}) no-repeat center/cover`}; /* 데스크톱 배경 */

  overflow: auto;
  position: relative; /* 로딩 컴포넌트를 절대적으로 배치하기 위해 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ $isSmallScreen }) =>
      $isSmallScreen ? `url(${FoodBg}) no-repeat center/cover` : "none"};
    filter: brightness(1.2);
    opacity: 0.1;
    z-index: -1;
  }
`;

const Header = styled.div`
  font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "28px" : "30px")};
  font-weight: bold;
`;

const Title = styled.div`
  font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "16px" : "30px")};
  font-weight: bold;
  color: #1e1e1e;
  margin: ${({ $isSmallScreen }) => ($isSmallScreen ? "18px 0 0 0" : "20px")};
`;

const Desc = styled.div`
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: ${({ $isSmallScreen }) => ($isSmallScreen ? "260px" : "")};
  margin: ${({ $isSmallScreen }) => ($isSmallScreen ? "0" : "10px 0")};
  margin-bottom: ${({ $isSmallScreen }) => ($isSmallScreen ? "10px" : "0")};
  font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "16px" : "20px")};
  color: #3a3a3a;
  line-height: 1.4;
`;

const Highlight = styled.span`
  background: linear-gradient(transparent 50%, #ffeb3b 50%);
  padding: 2px 4px;
  border-radius: 4px;
`;

const Contents = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LogoImg = styled.div`
  & > img {
    width: 300px;
    height: 300px;
    padding: 10px;
    margin: ${({ $isSmallScreen }) => ($isSmallScreen ? "16px" : "40px")};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    object-fit: cover;
  }
`;

const StartButton = styled.div`
  background: #2e2e2e;
  color: #fff;
  padding: 10px;
  margin-top: ${({ $isSmallScreen }) => ($isSmallScreen ? "0" : "30px")};
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    background: #fff;
    color: #2e2e2e;
    font-weight: bold;
    transform: scale(1.4);
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const handleClickButton = () => {
    setIsLoading(true); // 로딩 시작
    setTimeout(() => {
      navigate("/question"); // 로딩 후 /question 페이지로 이동
    }, 6000); // 2초 후 이동
  };
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  if (isLoading) {
    return <Loading />; // 로딩 중일 때 스피너 표시
  }

  return (
    <Wrapper $isSmallScreen={isSmallScreen}>
      <Header $isSmallScreen={isSmallScreen}>
        <Highlight>나만의 배달 습관 MBTI</Highlight>
      </Header>
      <Contents>
        <Title $isSmallScreen={isSmallScreen}>
          내 음식 취향과 배달 습관, MBTI로 알아보자!
        </Title>
        <LogoImg $isSmallScreen={isSmallScreen}>
          <img className="rounded-circle" src="/img/mainbg2.jpg" />
        </LogoImg>
        <Desc $isSmallScreen={isSmallScreen}>
          배달에서부터 음식 습관까지, <br />
          나만의 독특한 MBTI를 찾아보세요!
        </Desc>
        <StartButton $isSmallScreen={isSmallScreen} onClick={handleClickButton}>
          테스트 시작
        </StartButton>
      </Contents>
    </Wrapper>
  );
};

export default Home;
