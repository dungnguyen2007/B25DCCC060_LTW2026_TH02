import AnswerButton from "./AnswerButton";
import { LETTERS } from "../data";

const QuestionCard = ({
  question,
  questionNumber,
  selectedAnswer,
  status,
  hiddenAnswers,
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
            hidden={hiddenAnswers.includes(index)}
            onClick={onAnswer}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
