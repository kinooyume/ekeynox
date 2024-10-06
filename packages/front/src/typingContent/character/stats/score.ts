import { CharacterAdded, CharacterStatus } from "../types";

export type CharacterScore = {
  match: number;
  unmatch: number;
  extra: number;
  missed: number;
  total: number;
};

export type CharacterScoreFull = {
  added: CharacterScore;
  deleted: CharacterScore;
  cool: string;
};

export type CharacterScores = Record<string, CharacterScoreFull>;

const createCharacterScore = (): CharacterScore => ({
  match: 0,
  unmatch: 0,
  extra: 0,
  missed: 0,
  total: 0,
});

// Side Effect
const updateCharacterScore = (score: CharacterScore) => ({
  add: (status: CharacterAdded, expected: Array<string>) => {
    switch (status.kind) {
      case CharacterStatus.match:
        score.match++;
        break;
      case CharacterStatus.unmatch:
        score.unmatch++;
        expected.push(status.typed);
        break;
      case CharacterStatus.extra:
        score.extra++;
        break;
      case CharacterStatus.missed:
        score.missed++;
        expected.push(status.typed);
        break;
    }
    score.total++;
  },
  delete: (status: CharacterStatus) => {
    switch (status) {
      case CharacterStatus.match:
        score.match++;
        break;
      case CharacterStatus.unmatch:
        score.unmatch++;
        break;
      case CharacterStatus.extra:
        score.extra++;
        break;
      case CharacterStatus.missed:
        score.missed++;
        break;
    }
    score.total++;
  },
});

/* Side effect */
const pushCharacterScore = (
  target: CharacterScore,
  source: CharacterScore,
) => {
  target.match += source.match;
  target.unmatch += source.unmatch;
  target.extra += source.extra;
  target.missed += source.missed;
  target.total += source.total;
};

type diffCharracterScoreProps = {
  added: CharacterScore;
  deleted: CharacterScore;
};

const diffCharacterScore = ({ added, deleted }: diffCharracterScoreProps) : CharacterScore => ({
  match: added.match - deleted.match,
  unmatch: added.unmatch - deleted.unmatch,
  extra: added.extra - deleted.extra,
  missed: added.missed - deleted.missed,
  total: added.total - deleted.total,
});

const mergeCharacterScore = ({ added, deleted }: diffCharracterScoreProps) : CharacterScore => ({
  match: added.match + deleted.match,
  unmatch: added.unmatch + deleted.unmatch,
  extra: added.extra + deleted.extra,
  missed: added.missed + deleted.missed,
  total: added.total + deleted.total,
});

// Event back
export {
  createCharacterScore,
  updateCharacterScore,
  pushCharacterScore,
  diffCharacterScore,
  mergeCharacterScore,
};
