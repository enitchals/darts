import { bullsOperations } from "./games/bulls";
import { cricketOperations } from "./games/cricket";
import { cutThroatOperations } from "./games/cutThroat";
import { ohGamesOperations } from "./games/oh1";
import { Game, Dart, GameOperations, GameName, Player, Mark } from "./types";

export const dartValue = (dart: Dart): number => dart[0] * dart[1];

export const currentRound = (players: Player[]) => {
  const highestDart = players.reduce((acc, player) => {
    if (acc > player.darts.length) {
      return acc;
    }

    return player.darts.length;
  }, 0);

  return Math.ceil(highestDart / 3);
};

export const playerMarks = (player: Player): { [key: number]: number } =>
  player.darts.reduce((acc, dart) => {
    if (Object.prototype.hasOwnProperty.call(acc, dart[0])) {
      acc[dart[0]] = acc[dart[0]] + dart[1];
    } else {
      acc[dart[0]] = dart[1];
    }

    return acc;
  }, {});

export const playersScoresCutThroat = (
  game: Game,
  players: Player[]
): { playersToScore: number[]; playersToMarkTotal: number[] } => {
  const emptyMarks = game.marks.reduce((acc, mark) => {
    acc[mark] = 0;
    return acc;
  }, {});
  const playersToMarks: { [mark: number]: number }[] = new Array(players.length)
    .fill({})
    .map(() => JSON.parse(JSON.stringify(emptyMarks)));
  const playersToMarkTotal: number[] = new Array(players.length).fill(0);
  const playersToScore: number[] = new Array(players.length).fill(0);
  const highestRound = currentRound(players);
  const dartsInOrderThrown: [dart: Dart, playerIndex: number][] = [];

  for (let round = 0; round <= highestRound; round++) {
    players.forEach((player, playerIndex) => {
      const first = player.darts[round * 3];
      const second = player.darts[round * 3 + 1];
      const third = player.darts[round * 3 + 2];

      if (first) {
        dartsInOrderThrown.push([first, playerIndex]);
      }

      if (second) {
        dartsInOrderThrown.push([second, playerIndex]);
      }

      if (third) {
        dartsInOrderThrown.push([third, playerIndex]);
      }
    });
  }

  dartsInOrderThrown.forEach((dartTuple) => {
    const playerIndex = dartTuple[1];
    const dart = dartTuple[0];

    if (dart[0] === Mark.Miss) {
      return;
    }

    const canScore = playersToMarks[playerIndex][dart[0]] + dart[1] > 3;

    if (canScore) {
      const playersWhoGetScored = playersToMarks.slice();
      delete playersWhoGetScored[playerIndex];

      playersToMarks.forEach((playerMarks, index) => {
        if (playerMarks[dart[0]] >= 3) {
          delete playersWhoGetScored[index];
        }
      });

      playersWhoGetScored.forEach((scoredPlayer, index) => {
        const playerMarksSoFar = playersToMarks[playerIndex][dart[0]];

        let scoringValue = 0;
        if (playerMarksSoFar >= 3) {
          scoringValue = dartValue(dart);
        } else {
          const diff = Math.abs(playerMarksSoFar - 3);

          scoringValue = dartValue([dart[0], dart[1] - diff]);
        }

        playersToScore[index] = playersToScore[index] + scoringValue;
      });
    }

    playersToMarkTotal[playerIndex] = playersToMarkTotal[playerIndex] + dart[1];

    playersToMarks[playerIndex][dart[0]] = playersToMarks[playerIndex][dart[0]] + dart[1];
  });

  return { playersToScore, playersToMarkTotal };
};

export const isMarkCleared = (player: Player, mark: Mark): boolean => 3 <= playerMarks(player)[mark];

export const areMarksCleared = (game: Game, player: Player): boolean =>
  game.marks.every((mark) => isMarkCleared(player, mark));

export const isMarkClearedForEveryone = (players: Player[], mark: Mark) =>
  players.reduce((acc, player) => {
    if (!isMarkCleared(player, mark)) {
      return false;
    }

    return acc;
  }, true);

export const findLastPlayerToThrow = (players: Player[], currentPlayerIndex: number): Player => {
  let player = players[currentPlayerIndex];
  const dartsLength = player?.darts.length;

  const anyoneThrownYet = players.reduce((acc, player) => (player.darts.length ? true : acc), false);

  // player has not thrown yet this round
  // so the last player was the last to throw
  if (anyoneThrownYet && dartsLength % 3 === 0) {
    if (currentPlayerIndex === 0) {
      player = players[players.length - 1];
    } else {
      player = players[currentPlayerIndex - 1];
    }
  }

  return player;
};

export const gameOperations = (game: Game): GameOperations => {
  switch (game?.name) {
    case GameName.Oh1:
      return ohGamesOperations(game);
    case GameName.Bulls:
      return bullsOperations(game);
    case GameName.Cricket:
      return cricketOperations(game);
    case GameName.CutThroat:
      return cutThroatOperations(game);
    default:
      return {
        validThrow: () => false,
        didWin: () => null,
      };
  }
};

export { bulls } from "./games/bulls";
export { cricket } from "./games/cricket";
export { ohGames } from "./games/oh1";
export { cutThroat } from "./games/cutThroat";
