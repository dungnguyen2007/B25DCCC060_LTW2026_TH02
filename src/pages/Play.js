import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  PRIZES,
  MILESTONES,
  LETTERS,
  TIME_PER_QUESTION,
  formatMoney,
} from "../data";

// Hàm tính tiền thưởng
const calcPrize = (correctCount, reason) => {
  if (reason === "win") {
    return PRIZES[PRIZES.length - 1];
  }

  if (reason === "stop") {
    return correctCount === 0 ? 0 : PRIZES[correctCount - 1];
  }

  const passedMilestones = MILESTONES.filter(
    (milestone) => milestone <= correctCount,
  );

  if (passedMilestones.length === 0) {
    return 0;
  }

  const highestMilestone = passedMilestones[passedMilestones.length - 1];

  return PRIZES[highestMilestone - 1];
};

// Nút trả lời
const AnswerButton = ({
  letter,
  answer,
  index,
  selectedAnswer,
  correctAnswer,
  status,
  onClick,
}) => {
  let buttonColor = "#ffffff";
  let textColor = "#222222";

  if (status === "locked" && selectedAnswer === index) {
    buttonColor = "#ff9800";
    textColor = "#ffffff";
  }

  if (status === "revealed") {
    if (index === correctAnswer) {
      buttonColor = "#4caf50";
      textColor = "#ffffff";
    } else if (index === selectedAnswer) {
      buttonColor = "#f44336";
      textColor = "#ffffff";
    }
  }

  return (
    <button
      type="button"
      disabled={status !== "answering"}
      onClick={() => onClick(index)}
      style={{
        padding: "16px",
        border: "1px solid #cccccc",
        borderRadius: "8px",
        backgroundColor: buttonColor,
        color: textColor,
        cursor: status === "answering" ? "pointer" : "not-allowed",
        textAlign: "left",
        fontSize: "16px",
      }}
    >
      {letter}. {answer}
      {status === "revealed" && index === correctAnswer ? " (Đáp án đúng)" : ""}
    </button>
  );
};

// Thẻ câu hỏi và 4 đáp án
const QuestionCard = ({
  question,
  questionNumber,
  selectedAnswer,
  status,
  onAnswer,
}) => {
  return (
    <div>
      <h2>Câu {questionNumber}/15</h2>

      <h3>{question.question}</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "12px",
        }}
      >
        {question.options.map((answer, index) => (
          <AnswerButton
            key={index}
            letter={LETTERS[index]}
            answer={answer}
            index={index}
            selectedAnswer={selectedAnswer}
            correctAnswer={question.answer}
            status={status}
            onClick={onAnswer}
          />
        ))}
      </div>
    </div>
  );
};

// Đồng hồ đếm ngược
const Timer = ({ timeLeft }) => {
  return (
    <h3
      style={{
        color: timeLeft <= 10 ? "red" : "inherit",
      }}
    >
      Còn {timeLeft} giây
    </h3>
  );
};

// Thang tiền thưởng
const MoneyLadder = ({ currentQuestion }) => {
  return (
    <div>
      <h3>Thang tiền thưởng</h3>

      <ol
        reversed
        style={{
          paddingLeft: "35px",
        }}
      >
        {[...PRIZES].reverse().map((prize, index) => {
          const questionNumber = PRIZES.length - index;
          const isMilestone = MILESTONES.includes(questionNumber);
          const isCurrent = currentQuestion === questionNumber;

          return (
            <li
              key={questionNumber}
              value={questionNumber}
              style={{
                padding: "5px",
                marginBottom: "3px",
                fontWeight: isMilestone ? "bold" : "normal",
                backgroundColor: isCurrent ? "#ffcc80" : "transparent",
                borderRadius: "4px",
              }}
            >
              Câu {questionNumber}: {formatMoney(prize)}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

// Màn hình chơi game
const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [status, setStatus] = useState("answering");

  const currentQuestion = questions[currentIndex];

  // Kết thúc lượt chơi và chuyển sang trang kết quả
  const endGame = useCallback(
    (count, reason) => {
      navigate("/result", {
        replace: true,
        state: {
          playerName,
          correctCount: count,
          prize: calcPrize(count, reason),
          reason,
        },
      });
    },
    [navigate, playerName],
  );

  // Đếm ngược: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== "answering") {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          setStatus("timeout");
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [status]);

  // Xử lý các bước: khóa đáp án -> hiện kết quả -> chuyển câu/kết thúc
  useEffect(() => {
    if (status === "locked") {
      const timeoutId = setTimeout(() => {
        setStatus("revealed");
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    if (status === "revealed") {
      const timeoutId = setTimeout(() => {
        if (selectedAnswer === currentQuestion.answer) {
          const newCorrectCount = correctCount + 1;

          setCorrectCount(newCorrectCount);

          if (newCorrectCount === 15) {
            endGame(newCorrectCount, "win");
          } else {
            setCurrentIndex((previousIndex) => previousIndex + 1);
            setSelectedAnswer(null);
            setTimeLeft(TIME_PER_QUESTION);
            setStatus("answering");
          }
        } else {
          endGame(correctCount, "wrong");
        }
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    if (status === "timeout") {
      endGame(correctCount, "timeout");
    }
  }, [status, selectedAnswer, currentQuestion, correctCount, endGame]);

  const handleAnswer = (answerIndex) => {
    if (status !== "answering") {
      return;
    }

    setSelectedAnswer(answerIndex);
    setStatus("locked");
  };

  if (!currentQuestion) {
    return <p>Không có dữ liệu câu hỏi.</p>;
  }

  return (
    <div>
      <h1>Ai là triệu phú</h1>

      <p>Người chơi: {playerName}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(220px, 1fr)",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div>
          <Timer timeLeft={timeLeft} />

          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            selectedAnswer={selectedAnswer}
            status={status}
            onAnswer={handleAnswer}
          />
        </div>

        <MoneyLadder currentQuestion={currentIndex + 1} />
      </div>
    </div>
  );
};

export default Play;
