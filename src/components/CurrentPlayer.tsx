import React from "react";
import { DartLabel } from "./DartLabel";
import { useStore } from "../machine";
import { dartValue } from "../games";

export const CurrentPlayer = () => {
  const currentPlayerIndex = useStore((state) => state.currentPlayerIndex);
  const players = useStore((state) => state.players);
  const game = useStore((state) => state.game);

  const currentPlayer = players[currentPlayerIndex] || null;

  if (!currentPlayer) {
    return <div></div>;
  }

  const numOfThrows = currentPlayer.darts.length;

  let last3Throws = [];
  let thisRoundThrows = [];

  const remainder = numOfThrows % 3;
  const lastRoundThrow = numOfThrows - remainder;

  last3Throws = currentPlayer.darts.slice(lastRoundThrow - 3, lastRoundThrow);

  if (remainder) {
    thisRoundThrows = currentPlayer.darts.slice(lastRoundThrow);
  }

  const total = currentPlayer?.darts.reduce((acc, thrw) => acc + dartValue(thrw), 0);
  const left = game.limit ? game.limit - total : null;

  return (
    <div className="currentPlayer">
      <h2>{currentPlayer.name}</h2>
      {left && (
        <div style={{ marginTop: "0.25em", display: "inline-block" }}>
          total: <span style={{ fontSize: "4em", marginRight: "0.25em" }}>{total}</span>
          left: <span style={{ fontSize: "4em", marginRight: "0.25em" }}>{left}</span>
        </div>
      )}
      {thisRoundThrows.map((dart, idx) => (
        <DartLabel key={`${idx}${dart}`} dart={dart} />
      ))}
    </div>
  );
};
