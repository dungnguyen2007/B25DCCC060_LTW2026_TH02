const AnswerButton = ({
  letter,
  answer,
  index,
  selectedAnswer,
  correctAnswer,
  status,
  hidden,
  onClick,
}) => {
  let backgroundColor = "#ffffff";
  let color = "#222222";

  if (status === "locked" && selectedAnswer === index) {
    backgroundColor = "#ff9800";
    color = "#ffffff";
  }

  if (status === "revealed") {
    if (index === correctAnswer) {
      backgroundColor = "#4caf50";
      color = "#ffffff";
    } else if (index === selectedAnswer) {
      backgroundColor = "#f44336";
      color = "#ffffff";
    }
  }

  return (
    <button
      type="button"
      disabled={status !== "answering" || hidden}
      onClick={() => onClick(index)}
      style={{
        minHeight: "58px",
        padding: "16px",
        border: "1px solid #cccccc",
        borderRadius: "8px",
        backgroundColor,
        color,
        cursor: status === "answering" && !hidden ? "pointer" : "not-allowed",
        textAlign: "left",
        fontSize: "16px",
      }}
    >
      {hidden ? "" : `${letter}. ${answer}`}
    </button>
  );
};

export default AnswerButton;
