import React, { useState, useRef } from "react";
import { Button, ProgressBar } from "react-bootstrap";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { createSearchParams, useNavigate } from "react-router-dom";
import { QuestionData } from "../assets/questiondata";
import FoodBg from "../image/foodbg.jpg";
import FoodBg2 from "../image/foodbg2.jpg";
import LoadingResult from "./LodadingResult";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${({ $isSmallScreen }) => ($isSmallScreen ? "84vh" : "98vh")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
  background: ${({ $isSmallScreen }) =>
    $isSmallScreen
      ? "transparent"
      : `url(${FoodBg2}) no-repeat center/cover`}; /* 데스크톱 배경 */

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ $isSmallScreen }) =>
      $isSmallScreen ? `url(${FoodBg}) no-repeat center/cover` : "none"};
    filter: brightness(0.9);
    opacity: 0.2;
    z-index: -1;
  }
`;

const Title = styled.div`
  font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "20px" : "30px")};
  width: ${({ $isSmallScreen }) => ($isSmallScreen ? "300px" : "auto")};
  padding: ${({ $isSmallScreen }) => ($isSmallScreen ? "6px 12px" : "auto")};
  text-align: center;
  margin-bottom: ${({ $isSmallScreen }) => ($isSmallScreen ? "22px" : "100px")};
  padding: 8px 16px;
  background: rgba(255, 255, 255 0.2);
  color: #181818;
  font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "18px" : "30px")};
  font-weight: bold;
  border-radius: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: ${({ $isSmallScreen }) => ($isSmallScreen ? "column" : "")};
  justify-content: center;
  align-items: center;
  gap: ${({ $isSmallScreen }) => ($isSmallScreen ? "20px" : "40px")};
  & > button {
    width: ${({ $isSmallScreen }) => ($isSmallScreen ? "320px" : "600px")};
    height: ${({ $isSmallScreen }) => ($isSmallScreen ? "200px" : "400px")};
    font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "14px" : "18px")};
  }
`;

const CustomButton = styled(Button)`
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid transparent;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(255, 35, 35, 0.8); /* 호버 시 항상 빨간 배경 */
    border: 2px solid #fff;
    color: #fff; /* 글자색을 항상 흰색으로 유지 */
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    &:hover {
      background: rgba(0, 0, 0, 0.8); /* 원래 배경 유지 */
      border: 2px solid transparent;
      color: #fff;
      transform: none;
    }

    &:active {
      background: rgba(0, 0, 0, 0.8); /* 클릭 효과도 없앰 */
      border: 2px solid transparent;
      color: #fff;
    }
  }
`;

const Question = () => {
  const [questionNo, setQuestionNo] = useState(0);
  const [totalScore, setTotalScore] = useState([
    { id: "EI", score: 0 },
    { id: "SN", score: 0 },
    { id: "TF", score: 0 },
    { id: "JP", score: 0 },
  ]);
  const [clickedButton, setClickedButton] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const navigate = useNavigate();
  const answerARef = useRef(null);
  const answerBRef = useRef(null);

  const handleClickButton = (no, type, ref, button) => {
    const newScore = totalScore.map((s) =>
      s.id === type ? { id: s.id, score: s.score + no } : s
    );
    setTotalScore(newScore);

    if (ref && ref.current) {
      ref.current.blur();
    }

    setClickedButton(button);

    // 마지막 질문일 때 로딩 화면 표시
    if (QuestionData.length !== questionNo + 1) {
      setQuestionNo(questionNo + 1);
    } else {
      setIsLoading(true); // 로딩 시작
      setTimeout(() => {
        const mbti = newScore.reduce(
          (acc, curr) =>
            acc +
            (curr.score >= 2
              ? curr.id.substring(0, 1)
              : curr.id.substring(1, 2)),
          ""
        );
        setIsLoading(false); // 로딩 종료
        navigate({
          pathname: "/result",
          search: `?${createSearchParams({ mbti })}`,
        });
      }, 6000); // 2초 후 결과로 이동
    }
  };

  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <>
      {isLoading && <LoadingResult />} {/* 로딩 화면 표시 */}
      <ProgressBar
        striped
        variant="info"
        now={(questionNo / QuestionData.length) * 100}
      />
      <Wrapper $isSmallScreen={isSmallScreen}>
        <Title $isSmallScreen={isSmallScreen}>
          {QuestionData[questionNo].title}
        </Title>
        <ButtonGroup $isSmallScreen={isSmallScreen}>
          <CustomButton
            ref={answerARef}
            variant="light"
            $isClicked={clickedButton === "A"}
            onClick={() =>
              handleClickButton(
                1,
                QuestionData[questionNo].type,
                answerARef,
                "A"
              )
            }
          >
            <img
              src={QuestionData[questionNo].imagea}
              alt="Answer A"
              style={{
                width: isSmallScreen ? "200px" : "500px",
                height: isSmallScreen ? "auto" : "300px",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
            {QuestionData[questionNo].answera}
          </CustomButton>

          <CustomButton
            ref={answerBRef}
            variant="light"
            $isClicked={clickedButton === "B"}
            onClick={() =>
              handleClickButton(
                0,
                QuestionData[questionNo].type,
                answerBRef,
                "B"
              )
            }
          >
            <img
              src={QuestionData[questionNo].imageb}
              alt="Answer B"
              style={{
                width: isSmallScreen ? "180px" : "500px",
                height: isSmallScreen ? "120px" : "300px",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
            {QuestionData[questionNo].answerb}
          </CustomButton>
        </ButtonGroup>
      </Wrapper>
    </>
  );
};

export default Question;
