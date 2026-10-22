import { formatMoney } from "../data";

const History = ({ history, setHistory }) => {
  // Sắp xếp trên bản sao, không sửa trực tiếp state
  const sortedHistory = [...history].sort((a, b) => b.prize - a.prize);

  // Tính tổng tiền thưởng
  const totalPrize = history.reduce((total, record) => total + record.prize, 0);

  // Tìm tiền thưởng cao nhất
  const highestPrize = history.reduce(
    (highest, record) => Math.max(highest, record.prize),
    0,
  );

  const handleClearHistory = () => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa toàn bộ lịch sử chơi?",
    );

    if (confirmed) {
      setHistory([]);
    }
  };

  return (
    <div>
      <h1>Lịch sử chơi</h1>

      <p>Số lượt chơi: {history.length}</p>
      <p>Tiền thưởng cao nhất: {formatMoney(highestPrize)}</p>
      <p>Tổng tiền thưởng: {formatMoney(totalPrize)}</p>

      <button
        type="button"
        onClick={handleClearHistory}
        disabled={history.length === 0}
      >
        Xóa lịch sử
      </button>

      {history.length === 0 ? (
        <p>Chưa có lượt chơi nào.</p>
      ) : (
        <div style={{ overflowX: "auto", marginTop: "16px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Người chơi
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Số câu đúng
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Tiền thưởng
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Thời gian
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedHistory.map((record) => (
                <tr key={record.id}>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    {record.name}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    {record.correctCount}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    {formatMoney(record.prize)}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    {record.playedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
