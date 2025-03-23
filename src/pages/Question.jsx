import React, { useState, useRef } from "react";
import { Button, ProgressBar } from "react-bootstrap";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { createSearchParams, useNavigate } from "react-router-dom";
import { QuestionData } from "../assets/questiondata";

const Wrapper = styled.div`
  width: 100%;
  height: ${({ $isSmallScreen }) => ($isSmallScreen ? "84vh" : "98vh")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ddd;
`;

const Title = styled.div`
  font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "18px" : "30px")};
  width: ${({ $isSmallScreen }) => ($isSmallScreen ? "300px" : "auto")};
  padding: ${({ $isSmallScreen }) => ($isSmallScreen ? "6px 12px" : "auto")};
  text-align: center;
  margin-bottom: 10px;
  padding: 8px 16px;
  background: rgba(255, 255, 255 0.2);
  color: #181818;
  font-weight: bold;
  border-radius: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: ${({ $isSmallScreen }) => ($isSmallScreen ? "column" : "")};
  justify-content: center;
  align-items: center;
  gap: ${({ $isSmallScreen }) => ($isSmallScreen ? "10px" : "40px")};
  & > button {
    width: ${({ $isSmallScreen }) => ($isSmallScreen ? "300px" : "600px")};
    height: ${({ $isSmallScreen }) => ($isSmallScreen ? "200px" : "400px")};
    font-size: ${({ $isSmallScreen }) => ($isSmallScreen ? "16px" : "18px")};
  }
`;

const CustomButton = styled(Button)`
  background: white;
  border: 2px solid #007bff;
  color: #007bff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &:hover {
    background: #007bff;
    border: 2px solid #fff;
    color: white;
    transform: scale(1.05);
    transition: all 0.2s ease-in-out;
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

  const navigate = useNavigate();

  // 버튼 포커스를 제어하기 위한 useRef 설정
  const answerARef = useRef(null);
  const answerBRef = useRef(null);

  // 중복된 함수 제거 후, handleClickButton 하나로 통합
  const handleClickButton = (no, type, ref) => {
    const newScore = totalScore.map((s) =>
      s.id === type ? { id: s.id, score: s.score + no } : s
    );

    setTotalScore(newScore);

    // 버튼 클릭 후 포커스 해제
    if (ref && ref.current) {
      ref.current.blur();
    }

    // 다음 질문으로 넘어가기
    if (QuestionData.length !== questionNo + 1) {
      setQuestionNo(questionNo + 1);
    } else {
      const mbti = newScore.reduce(
        (acc, curr) =>
          acc +
          (curr.score >= 2 ? curr.id.substring(0, 1) : curr.id.substring(1, 2)),
        ""
      );
      navigate({
        pathname: "/result",
        search: `?${createSearchParams({ mbti })}`,
      });
    }
  };

  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <>
      <ProgressBar
        striped
        variant="info"
        now={(questionNo / QuestionData.length) * 100}
      />
      <Wrapper $isSmallScreen={isSmallScreen}>
        <Title $isSmallScreen={isSmallScreen}>
          {QuestionData[questionNo].title}
        </Title>
        {/* <ButtonGroup $isSmallScreen={isSmallScreen}>
          <CustomButton
            ref={answerARef}
            variant="light"
            onClick={() =>
              handleClickButton(1, QuestionData[questionNo].type, answerARef)
            }
          >
            {QuestionData[questionNo].answera}
          </CustomButton>
          <CustomButton
            ref={answerBRef}
            variant="light"
            onClick={() =>
              handleClickButton(0, QuestionData[questionNo].type, answerBRef)
            }
          >
            {QuestionData[questionNo].answerb}
          </CustomButton>
        </ButtonGroup> */}
        <ButtonGroup $isSmallScreen={isSmallScreen}>
          <CustomButton
            ref={answerARef}
            variant="light"
            onClick={() =>
              handleClickButton(1, QuestionData[questionNo].type, answerARef)
            }
          >
            <img
              src={QuestionData[questionNo].imagea}
              alt="Answer A"
              style={{
                width: isSmallScreen ? "180px" : "500px",
                height: isSmallScreen ? "auto" : "300px",
                objectFit: "cover",
                marginTop: "10px",
              }}
            />
            {QuestionData[questionNo].answera}
          </CustomButton>

          <CustomButton
            ref={answerBRef}
            variant="light"
            onClick={() =>
              handleClickButton(0, QuestionData[questionNo].type, answerBRef)
            }
          >
            <img
              src={QuestionData[questionNo].imageb}
              alt="Answer B"
              style={{
                width: isSmallScreen ? "180px" : "500px",
                height: isSmallScreen ? "auto" : "300px",
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
