import { useNavigate, useParams } from "react-router-dom";
import { LETTERS, LEVELS } from "../data";

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const question = questions.find((q) => q.id === Number(id));

  if (!question) {
    return (
      <div>
        <h2>Không tìm thấy câu hỏi</h2>

        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  return (
    <div>
      <h2>
        Câu hỏi số {question.id} ({LEVELS[question.level]})
      </h2>

      <p>{question.question}</p>

      <div className="options">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={index === question.answer ? "correct-answer" : "answer"}
          >
            {LETTERS[index]}. {option}
            {index === question.answer && <strong> (Đáp án đúng)</strong>}
          </div>
        ))}
      </div>

      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
};

export default QuestionDetail;
