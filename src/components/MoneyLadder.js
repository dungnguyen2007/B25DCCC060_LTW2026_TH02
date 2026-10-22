import { PRIZES, MILESTONES, formatMoney } from "../data";

const MoneyLadder = ({ currentQuestion }) => {
  return (
    <div>
      <h3>Thang tiền thưởng</h3>

      <ol reversed style={{ paddingLeft: "35px" }}>
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

export default MoneyLadder;
