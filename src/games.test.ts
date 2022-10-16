import { areMarksCleared, dartValue, findLastPlayerToThrow, ohGames } from "./games";
import { Game, GameName, Mark, Multiple, Player } from "./types";

describe("findLastPlayerToThrow", () => {
  it("handles the start of a game ( no darts thrown yet ) one player", () => {
    const player = { name: "me", darts: [] };
    const result = findLastPlayerToThrow([player], 0);
    expect(result).toBe(player);
  });

  it("handles the start of a game ( no darts thrown yet ) more than one player", () => {
    const player = { name: "me", darts: [] };
    const result = findLastPlayerToThrow([player, { name: "them", darts: [] }], 0);
    expect(result).toBe(player);
  });
});

describe("dartValue", () => {
  it("adds", () => {
    const result = dartValue([Mark.Bull, Multiple.Double]);
    expect(result).toBe(50);
  });
});

describe("areMarksCleared", () => {
  const game = ohGames();
  const player: Player = { name: "me", darts: [] };

  it("handles no darts", () => {
    const result = areMarksCleared(game, player);

    expect(result).toBe(false);
  });

  it("will see all cleared marks and ignore misses", () => {
    const smallGame: Game = {
      name: GameName.Bulls,
      checkIn: Multiple.Single,
      checkOut: Multiple.Single,
      limit: 50,
      marks: [Mark.Bull],
      multiples: [Multiple.Single, Multiple.Double, Multiple.Triple],
      clear: false,
      pointing: false,
    };
    const aPlayer: Player = {
      name: "me",
      darts: [
        [Mark.Miss, Multiple.Single],
        [Mark.Miss, Multiple.Single],
        [Mark.Bull, Multiple.Single],
        [Mark.Bull, Multiple.Double],
      ],
    };
    const result = areMarksCleared(smallGame, aPlayer);

    expect(result).toBe(true);
  });
});
