import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import MoneyLadder from "../components/MoneyLadder";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  PRIZES,
  MILESTONES,
  LETTERS,
  TIME_PER_QUESTION,
  formatMoney,
} from "../data";
import { calcPrize } from "../utils";
import Lifelines from "../components/Lifelines";
import AudienceChart from "../components/AudienceChart";

const createAudienceVotes = (question, hiddenAnswers) => {
  const correctIndex = question.answer;

  const visibleWrongAnswers = question.options
    .map((_, index) => index)
    .filter(
      (index) => index !== correctIndex && !hiddenAnswers.includes(index),
    );

  const minPercent = visibleWrongAnswers.length === 1 ? 51 : 40;

  const correctPercent =
    Math.floor(Math.random() * (70 - minPercent + 1)) + minPercent;

  const votes = { A: 0, B: 0, C: 0, D: 0 };
  votes[LETTERS[correctIndex]] = correctPercent;

  let remaining = 100 - correctPercent;

  while (remaining > 0 && visibleWrongAnswers.length > 0) {
    const eligibleAnswers = visibleWrongAnswers.filter(
      (index) => votes[LETTERS[index]] < correctPercent - 1,
    );

    if (eligibleAnswers.length === 0) {
      break;
    }

    const randomIndex = Math.floor(Math.random() * eligibleAnswers.length);

    const letter = LETTERS[eligibleAnswers[randomIndex]];
    votes[letter] += 1;
    remaining -= 1;
  }

  return votes;
};

const Play = ({ questions, playerName, onGameEnd }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [status, setStatus] = useState("answering");

  const [usedLifelines, setUsedLifelines] = useState({
    fiftyFifty: false,
    audience: false,
  });
  const [hiddenAnswers, setHiddenAnswers] = useState([]);
  const [votes, setVotes] = useState(null);

  const currentQuestion = questions[currentIndex];

  const endGame = useCallback(
    (count, reason) => {
      const result = {
        playerName,
        correctCount: count,
        prize: calcPrize(count, reason),
        reason,
      };

      onGameEnd(result);

      navigate("/result", {
        replace: true,
        state: result,
      });
    },
    [navigate, playerName, onGameEnd],
  );

  useEffect(() => {
    if (status !== "answering") {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((previousTime) => (previousTime > 0 ? previousTime - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status]);

  useEffect(() => {
    if (status === "answering" && timeLeft === 0) {
      setStatus("timeout");
    }
  }, [status, timeLeft]);

  useEffect(() => {
    if (status === "locked") {
      const timeoutId = setTimeout(() => {
        setStatus("revealed");
      }, 1000);

      return () => clearTimeout(timeoutId);
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
            setHiddenAnswers([]);
            setVotes(null);
            setStatus("answering");
          }
        } else {
          endGame(correctCount, "wrong");
        }
      }, 2000);

      return () => clearTimeout(timeoutId);
    }

    if (status === "timeout") {
      endGame(correctCount, "timeout");
    }
  }, [status, selectedAnswer, currentQuestion, correctCount, endGame]);

  useEffect(() => {
    document.title = `Câu ${currentIndex + 1}/15 – ${playerName}`;

    return () => {
      document.title = "Ai là triệu phú";
    };
  }, [currentIndex, playerName]);

  const handleAnswer = useCallback(
    (answerIndex) => {
      if (status !== "answering") {
        return;
      }

      if (hiddenAnswers.includes(answerIndex)) {
        return;
      }

      setSelectedAnswer(answerIndex);
      setStatus("locked");
    },
    [status, hiddenAnswers],
  );

  useEffect(() => {
    const handleKey = (event) => {
      if (status !== "answering") {
        return;
      }

      const key = event.key.toUpperCase();
      const answerIndex = LETTERS.indexOf(key);

      if (answerIndex === -1) {
        return;
      }

      if (hiddenAnswers.includes(answerIndex)) {
        return;
      }

      handleAnswer(answerIndex);
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [status, hiddenAnswers, handleAnswer]);

  const handleFiftyFifty = () => {
    if (status !== "answering" || usedLifelines.fiftyFifty) {
      return;
    }

    const wrongAnswers = currentQuestion.options
      .map((_, index) => index)
      .filter((index) => index !== currentQuestion.answer);

    const shuffledWrongAnswers = [...wrongAnswers].sort(
      () => Math.random() - 0.5,
    );

    setHiddenAnswers(shuffledWrongAnswers.slice(0, 2));
    setUsedLifelines((previous) => ({
      ...previous,
      fiftyFifty: true,
    }));
    setVotes(null);
  };

  const handleAudience = () => {
    if (status !== "answering" || usedLifelines.audience) {
      return;
    }

    setVotes(createAudienceVotes(currentQuestion, hiddenAnswers));
    setUsedLifelines((previous) => ({
      ...previous,
      audience: true,
    }));
  };

  const handleStop = () => {
    if (status !== "answering") {
      return;
    }

    endGame(correctCount, "stop");
  };

  if (!currentQuestion) {
    return <p>Không có dữ liệu câu hỏi.</p>;
  }

  return (
    <div>
      <h1>Ai là triệu phú</h1>
      <p>Người chơi: {playerName}</p>

      <Lifelines
        usedLifelines={usedLifelines}
        canUse={status === "answering"}
        onUseFiftyFifty={handleFiftyFifty}
        onUseAudience={handleAudience}
        onStop={handleStop}
      />

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
            hiddenAnswers={hiddenAnswers}
            onAnswer={handleAnswer}
          />

          <AudienceChart votes={votes} />
        </div>

        <MoneyLadder currentQuestion={currentIndex + 1} />
      </div>
    </div>
  );
};

export default Play;
