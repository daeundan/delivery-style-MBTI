import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { ResultData } from "../assets/resultData";
import KakaoShareButton from "../components/KakaoShareButton";
import html2canvas from "html2canvas"; // html2canvas 추가
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  height: ${({ $isSmallScreen }) =>
    $isSmallScreen ? "80vh" : "88vh"}; /* 높이 조정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: #fff;
  background: #fff;
  overflow: auto; /* 내부 스크롤 허용 */
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${({ $isSmallScreen }) =>
    $isSmallScreen ? "60vh" : "90vh"}; /* 높이 줄이기 */
`;

const InnerLineTop = styled.div`
  width: ${({ $isSmallScreen }) => ($isSmallScreen ? "100%" : "90%")};
  height: ${({ $isSmallScreen }) => ($isSmallScreen ? "10px" : "10px")};
  background-color: ${({ $isSmallScreen }) =>
    $isSmallScreen ? "dodgerblue" : "transparent"};
  margin-top: 20px;
`;

const InnerLineBottom = styled.div`
  width: ${({ $isSmallScreen }) => ($isSmallScreen ? "100%" : "90%")};
  height: ${({ $isSmallScreen }) => ($isSmallScreen ? "10px" : "10px")};
  background-color: ${({ $isSmallScreen }) =>
    $isSmallScreen ? "dodgerblue" : "transparent"};
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Title = styled.div`
  color: #181818;
  font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "28px" : "42px")};
  margin-top: ${({ $isSmallScreen }) => ($isSmallScreen ? "12px" : "0")};
  margin-bottom: 12px;
`;

const SubTitle = styled.div`
  font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "22px" : "32px")};
  margin-bottom: 12px;
  color: #181818;
`;

const Desc = styled.div`
  font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "18px" : "22px")};
  margin: 20px 0;
  color: #181818;
  line-height: 1.4;
`;

const Highlight = styled.span`
  background: linear-gradient(transparent 50%, #ffeb3b 50%);
  padding: 2px 4px;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 12px;
`;

const KakaoLogo = styled.img`
  width: 40px;
`;

const RestartButton = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ $isSmallScreen }) => ($isSmallScreen ? "0" : "4px")};
  align-items: center;
  width: ${({ $isSmallScreen }) => ($isSmallScreen ? "60px" : "120px")};
  background-color: dodgerblue;
  border-radius: 8px;
  font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "20px" : "16px")};
  position: relative;
  cursor: pointer;

  span {
    display: ${({ $isSmallScreen }) => ($isSmallScreen ? "none" : "block")};
  }

  .hover-text {
    display: none; /* 기본적으로 숨김 */
    position: absolute;
    left: -4px;
    bottom: -20px;
    font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "12px" : "14px")};
    color: #181818;
    width: 80px;
  }

  @media (max-width: 768px) {
    &:hover .hover-text {
      display: block; /* 모바일에서만 호버 시 표시 */
    }
  }
`;
const LinkcopyButton = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ $isSmallScreen }) => ($isSmallScreen ? "0" : "4px")};
  align-items: center;
  width: ${({ $isSmallScreen }) => ($isSmallScreen ? "60px" : "120px")};
  background-color: #000;
  border-radius: 8px;
  font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "20px" : "16px")};
  position: relative;
  cursor: pointer;
  span {
    display: ${({ $isSmallScreen }) => ($isSmallScreen ? "none" : "block")};
  }

  .hover-text {
    display: none; /* 기본적으로 숨김 */
    position: absolute;
    left: -4px;
    bottom: -20px;
    font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "12px" : "14px")};
    color: #181818;
    width: 80px;
  }

  @media (max-width: 768px) {
    &:hover .hover-text {
      display: block; /* 모바일에서만 호버 시 표시 */
    }
  }
`;

const ShareButton = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ $isSmallScreen }) => ($isSmallScreen ? "0" : "4px")};
  align-items: center;
  width: ${({ $isSmallScreen }) => ($isSmallScreen ? "56px" : "120px")};
  background-color: #fff;
  color: #181818;
  border-radius: 8px;
  font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "28px" : "16px")};
  position: relative;
  cursor: pointer;
  span {
    display: ${({ $isSmallScreen }) => ($isSmallScreen ? "none" : "block")};
  }

  .hover-text {
    display: none; /* 기본적으로 숨김 */
    position: absolute;
    left: -4px;
    bottom: -20px;
    font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "12px" : "14px")};
    color: #181818;
    width: 80px;
  }

  @media (max-width: 768px) {
    &:hover .hover-text {
      display: block; /* 모바일에서만 호버 시 표시 */
    }
  }
`;

const Result = () => {
  const [resultData, setResultData] = useState({});
  const [searchParams] = useSearchParams();
  const mbti = searchParams.get("mbti");
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  const resultRef = useRef(null); // 캡처할 요소를 위한 ref 생성

  useEffect(() => {
    const result = ResultData.find((s) => s.best === mbti);
    setResultData(result);
  }, [mbti]);

  const handleClickButton = () => {
    navigate("/");
  };

  // 화면 캡처 후 저장하는 함수
  const handleSaveImage = () => {
    if (!resultRef.current) return;
    html2canvas(resultRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "result.png";
      link.click();
    });
  };

  // 인스타 공유 버튼 클릭 시 URL 복사
  const handleInstagramShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("결과 페이지 링크가 복사되었습니다!");
    });
  };

  return (
    <Wrapper $isSmallScreen={isSmallScreen} ref={resultRef}>
      <InnerLineTop $isSmallScreen={isSmallScreen} />
      <Inner $isSmallScreen={isSmallScreen}>
        <Title $isSmallScreen={isSmallScreen}>나만의 배달 습관 MBTI</Title>
        <SubTitle $isSmallScreen={isSmallScreen}>결과보기</SubTitle>
        <img
          src={resultData.image}
          alt="결과 이미지"
          style={{
            borderRadius: "50%",
            width: "200px",
            height: "200px",
            objectFit: "cover",
            aspectRatio: "1/1",
          }}
        />
        <Desc $isSmallScreen={isSmallScreen}>
          내 음식 취향과 배달 습관에 따른 MBTI는 <br />
          <Highlight>
            {resultData.best}형 {resultData.name}
          </Highlight>{" "}
          입니다.
        </Desc>
        <ButtonGroup>
          <RestartButton
            $isSmallScreen={isSmallScreen}
            onClick={handleClickButton}
          >
            <FontAwesomeIcon icon={faPlay} />
            <span>테스트 다시하기</span>
            <span className="hover-text">테스트 다시하기</span>
          </RestartButton>

          <KakaoShareButton variant="warning" mbti={mbti}>
            <KakaoLogo src="/cat/kakao.png" />
            <span> 결과 공유하기</span>
          </KakaoShareButton>
          <LinkcopyButton
            onClick={handleInstagramShare}
            $isSmallScreen={isSmallScreen}
          >
            <FontAwesomeIcon icon={faLink} /> <span>링크 복사하기</span>
            <span className="hover-text">링크 복사하기</span>
          </LinkcopyButton>
          <ShareButton onClick={handleSaveImage} $isSmallScreen={isSmallScreen}>
            <FontAwesomeIcon icon={faDownload} />
            <span>사진 저장하기</span>
            <span className="hover-text">사진 저장하기</span>
          </ShareButton>
        </ButtonGroup>
      </Inner>
      <InnerLineBottom $isSmallScreen={isSmallScreen} />
    </Wrapper>
  );
};

export default Result;
