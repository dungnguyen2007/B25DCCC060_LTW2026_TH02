const Timer = ({ timeLeft }) => {
  return (
    <h3 style={{ color: timeLeft <= 10 ? "red" : "inherit" }}>
      Còn {timeLeft} giây
    </h3>
  );
};

export default Timer;
