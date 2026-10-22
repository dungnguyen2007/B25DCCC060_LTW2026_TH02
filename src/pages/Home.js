import { useNavigate } from "react-router-dom";

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!playerName.trim()) {
      return;
    }

    navigate("/play");
  };

  return (
    <div>
      <h1>Ai là triệu phú</h1>

      <p>Chào mừng bạn đến với trò chơi Ai là triệu phú!</p>

      <p>Trả lời đúng 15 câu hỏi để nhận 250.000.000 đ.</p>

      <p>Mỗi câu có 30 giây để trả lời.</p>

      <p>Các câu 5, 10 và 15 là những mốc tiền thưởng an toàn.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="playerName">Tên người chơi:</label>

        <br />

        <input
          id="playerName"
          type="text"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Nhập tên của bạn"
        />

        <br />

        <button type="submit" disabled={!playerName.trim()}>
          Bắt đầu
        </button>
      </form>
    </div>
  );
};

export default Home;
