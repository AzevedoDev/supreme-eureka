export type MatchListT = {
  opponent: string;
  playerDeck: string;
  opponentDeck: string;
  result: string;
  duration: string;
  date: string;
  type: string;
  log: string;
  replay: string;
};

export type List = {
  [key: string]: string;
};

export type User = {
  position: number;
  username: string;
  rating: string;
  wins: string;
  loses: string;
  draws: string;
  experience: string;
};

export type RankingT = {
  entry1: string;
  entry2: string;
  entry3: string;
  entry4: string;
  entry5: string;
  entry6: string;
};
