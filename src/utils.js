import { PRIZES, MILESTONES } from "./data";

export const calcPrize = (correctCount, reason) => {
  if (reason === "win") {
    return PRIZES[PRIZES.length - 1];
  }

  if (reason === "stop") {
    return correctCount === 0 ? 0 : PRIZES[correctCount - 1];
  }

  const passedMilestones = MILESTONES.filter(
    (milestone) => milestone <= correctCount,
  );

  if (passedMilestones.length === 0) {
    return 0;
  }

  const highestMilestone = passedMilestones[passedMilestones.length - 1];

  return PRIZES[highestMilestone - 1];
};

export const createHistoryRecord = ({ playerName, correctCount, prize }) => ({
  id: `${Date.now()}-${Math.random()}`,
  name: playerName,
  prize,
  correctCount,
  playedAt: new Date().toLocaleString("vi-VN"),
});
