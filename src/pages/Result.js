import { useLocation, useNavigate } from "react-router-dom";
import { formatMoney } from "../data";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state;

  if (!result) {
    return null;
  }

  const { playerName, correctCount, prize, reason } = result;

  let title = "";

  if (reason === "win") {
    title = "Chúc mừng! Bạn đã trở thành triệu phú";
  } else if (reason === "wrong") {
    title = "Rất tiếc, bạn đã trả lời sai";
  } else if (reason === "timeout") {
    title = "Hết giờ!";
  } else if (reason === "stop") {
    title = "Bạn đã dừng cuộc chơi";
  }

  return (
    <div>
      <h1>{title}</h1>

      <p>Người chơi: {playerName}</p>

      <p>Số câu trả lời đúng: {correctCount}</p>

      <h2>Tiền thưởng: {formatMoney(prize)}</h2>

      <button type="button" onClick={() => navigate("/play")}>
        Chơi lại
      </button>

      <button type="button" onClick={() => navigate("/")}>
        Về trang chủ
      </button>
    </div>
  );
};

export default Result;
