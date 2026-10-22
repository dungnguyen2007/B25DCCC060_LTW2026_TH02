const AudienceChart = ({ votes }) => {
  if (!votes) {
    return null;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Kết quả bình chọn của khán giả</h3>

      {["A", "B", "C", "D"].map((letter) => {
        const percent = votes[letter] || 0;

        return (
          <div key={letter} style={{ marginBottom: "12px" }}>
            <div style={{ marginBottom: "4px" }}>
              {letter}: {percent}%
            </div>

            <div
              style={{
                width: "100%",
                height: "24px",
                backgroundColor: "#eeeeee",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  height: "100%",
                  backgroundColor: "#2196f3",
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AudienceChart;
