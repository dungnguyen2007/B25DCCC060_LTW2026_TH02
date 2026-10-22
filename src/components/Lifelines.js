const Lifelines = ({
  usedLifelines,
  canUse,
  onUseFiftyFifty,
  onUseAudience,
  onStop,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        margin: "16px 0",
      }}
    >
      <button
        type="button"
        disabled={!canUse || usedLifelines.fiftyFifty}
        onClick={onUseFiftyFifty}
      >
        50:50 {usedLifelines.fiftyFifty ? "(Đã dùng)" : ""}
      </button>

      <button
        type="button"
        disabled={!canUse || usedLifelines.audience}
        onClick={onUseAudience}
      >
        Hỏi khán giả {usedLifelines.audience ? "(Đã dùng)" : ""}
      </button>

      <button type="button" disabled={!canUse} onClick={onStop}>
        Dừng cuộc chơi
      </button>
    </div>
  );
};

export default Lifelines;
