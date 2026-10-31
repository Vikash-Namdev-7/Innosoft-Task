// Dummy catalogue data: 2 Cricket, 2 Football, and 2 Tennis matches.
// Prices and sizes are sample values, not live odds.

export type Runner = {
  handicap?: number;
  selectionId: number;
  sortPriority?: number;
  runnerName: string;
  status: string;
  meta?: { runnerId: string } | null;
  back?: { price: number; size: number }[];
  lay?: { price: number; size: number }[];
  backPrice1?: number;
  layPrice1?: number;
  backSize1?: number;
  laySize1?: number;
};

export type CatalogueRecord = {
  success: boolean;
  message: string;
  catalogue: {
    id: string;
    externalId: string;
    eventName: string;
    competitionId: number;
    competitionName: string;
    startTime: string;
    status: string;
    sport: string;
    inplay: boolean;
    markets: Record<string, {
      marketId: string;
      marketName: string;
      eventId: string;
      inplay: boolean;
      status: string;
      marketType: string;
      minBetAmount: number;
      maxBetAmount: number;
      type: string;
      minRate: number;
      maxRate: number;
      runners: Runner[];
    }[]>;
    fancyMarkets: Record<string, {
      marketId: string;
      marketName: string;
      marketCategory: string;
      gameType: string;
      gameStatus: string;
      ballSession: string;
      sortPriority: number;
      gtStatus: string;
      minBetAmount: number;
      maxBetAmount: number;
      type: string;
      remark: string;
      runners: Runner;
    }[]>;
  };
  betConfig: Record<string, string>;
};

export const matchCatalogues: CatalogueRecord[] = [
  {
    "success": true,
    "message": "Catalogue fetched successfully",
    "catalogue": {
      "id": "cricket-101",
      "externalId": "cricket-101",
      "eventName": "South Africa v Australia",
      "competitionId": 1,
      "competitionName": "Cricket Events",
      "startTime": "2026-10-27T14:00:00.000Z",
      "status": "Active",
      "sport": "Cricket",
      "inplay": true,
      "markets": {
        "Match Odds": [
          {
            "marketId": "market-cricket-101",
            "marketName": "Match Odds",
            "eventId": "cricket-101",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "Match Odds",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 1,
            "maxRate": 4,
            "runners": [
              {
                "handicap": 0,
                "selectionId": 1,
                "sortPriority": 1,
                "runnerName": "South Africa",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "1"
                },
                "back": [
                  {
                    "price": 2.42,
                    "size": 183.7
                  }
                ],
                "lay": [
                  {
                    "price": 2.46,
                    "size": 251.3
                  }
                ],
                "backPrice1": 2.42,
                "layPrice1": 2.46,
                "backSize1": 183.7,
                "laySize1": 251.3
              },
              {
                "handicap": 0,
                "selectionId": 2,
                "sortPriority": 2,
                "runnerName": "Australia",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "2"
                },
                "back": [
                  {
                    "price": 2.14,
                    "size": 1900
                  }
                ],
                "lay": [
                  {
                    "price": 2.16,
                    "size": 1100
                  }
                ],
                "backPrice1": 2.14,
                "layPrice1": 2.16,
                "backSize1": 1900,
                "laySize1": 1100
              },
              {
                "handicap": 0,
                "selectionId": 3,
                "sortPriority": 3,
                "runnerName": "The Draw",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "3"
                },
                "back": [
                  {
                    "price": 7.4,
                    "size": 2500
                  }
                ],
                "lay": [
                  {
                    "price": 7.6,
                    "size": 187.6
                  }
                ],
                "backPrice1": 7.4,
                "layPrice1": 7.6,
                "backSize1": 2500,
                "laySize1": 187.6
              }
            ]
          }
        ],
        "BOOKMAKER": [
          {
            "marketId": "bookmaker-cricket-101",
            "marketName": "BOOKMAKER",
            "eventId": "cricket-101",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "BOOKMAKER",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 10,
            "maxRate": 40,
            "runners": [
              {
                "selectionId": 101,
                "runnerName": "South Africa",
                "status": "ACTIVE",
                "backPrice1": 242,
                "layPrice1": 246,
                "backSize1": 100,
                "laySize1": 100,
                "back": [
                  {
                    "price": 242,
                    "size": 100
                  }
                ],
                "lay": [
                  {
                    "price": 246,
                    "size": 100
                  }
                ]
              },
              {
                "selectionId": 102,
                "runnerName": "Australia",
                "status": "ACTIVE",
                "backPrice1": 214,
                "layPrice1": 216,
                "backSize1": 100,
                "laySize1": 100,
                "back": [
                  {
                    "price": 214,
                    "size": 100
                  }
                ],
                "lay": [
                  {
                    "price": 216,
                    "size": 100
                  }
                ]
              }
            ]
          }
        ],
        "Tied Match": [
          {
            "marketId": "tied-cricket-101",
            "marketName": "Tied Match",
            "eventId": "cricket-101",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "Tied Match",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 1,
            "maxRate": 4,
            "runners": [
              {
                "selectionId": 201,
                "runnerName": "Yes",
                "status": "ACTIVE",
                "backPrice1": 3.5,
                "layPrice1": 4,
                "backSize1": 100,
                "laySize1": 100
              },
              {
                "selectionId": 202,
                "runnerName": "No",
                "status": "ACTIVE",
                "backPrice1": 1.2,
                "layPrice1": 1.3,
                "backSize1": 100,
                "laySize1": 100
              }
            ]
          }
        ]
      },
      "fancyMarkets": {
        "Normal": [
          {
            "marketId": "fancy-cricket-101-1",
            "marketName": "session",
            "marketCategory": "Normal",
            "gameType": "session",
            "gameStatus": "ACTIVE",
            "ballSession": "1",
            "sortPriority": 1,
            "gtStatus": "ACTIVE",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "remark": "",
            "runners": {
              "selectionId": 301,
              "runnerName": "South Africa total runs",
              "status": "ACTIVE",
              "backPrice1": 95,
              "layPrice1": 98,
              "backSize1": 100,
              "laySize1": 100
            }
          },
          {
            "marketId": "fancy-cricket-101-2",
            "marketName": "session",
            "marketCategory": "Normal",
            "gameType": "session",
            "gameStatus": "ACTIVE",
            "ballSession": "1",
            "sortPriority": 2,
            "gtStatus": "ACTIVE",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "remark": "",
            "runners": {
              "selectionId": 302,
              "runnerName": "Australia total runs",
              "status": "ACTIVE",
              "backPrice1": 90,
              "layPrice1": 93,
              "backSize1": 100,
              "laySize1": 100
            }
          }
        ],
        "Over By Over": []
      }
    },
    "betConfig": {
      "minBetAmount": "100",
      "maxBetAmount": "10000",
      "sessionMinBetAmount": "100",
      "sessionMaxBetAmount": "10000",
      "fancyMinBetAmount": "100",
      "fancyMaxBetAmount": "100000",
      "bookmakerMinBetAmount": "100",
      "bookmakerMaxBetAmount": "10000",
      "minRate": "4",
      "maxRate": "4",
      "sessionMinRate": "75",
      "sessionMaxRate": "130",
      "fancyMinRate": "1",
      "fancyMaxRate": "4",
      "bookmakerMinRate": "10",
      "bookmakerMaxRate": "40",
      "type": "default"
    }
  },
  {
    "success": true,
    "message": "Catalogue fetched successfully",
    "catalogue": {
      "id": "cricket-102",
      "externalId": "cricket-102",
      "eventName": "India W v Zimbabwe W",
      "competitionId": 1,
      "competitionName": "Cricket Events",
      "startTime": "2026-10-28T14:00:00.000Z",
      "status": "Active",
      "sport": "Cricket",
      "inplay": true,
      "markets": {
        "Match Odds": [
          {
            "marketId": "match-odds-cricket-102",
            "marketName": "Match Odds",
            "eventId": "cricket-102",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "Match Odds",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 1,
            "maxRate": 4,
            "runners": [
              {
                "handicap": 0,
                "selectionId": 1,
                "sortPriority": 1,
                "runnerName": "India W",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "1"
                },
                "back": [
                  {
                    "price": 1.01,
                    "size": 350
                  }
                ],
                "lay": [
                  {
                    "price": 1.05,
                    "size": 270
                  }
                ],
                "backPrice1": 1.01,
                "layPrice1": 1.05,
                "backSize1": 350,
                "laySize1": 270
              },
              {
                "handicap": 0,
                "selectionId": 2,
                "sortPriority": 2,
                "runnerName": "Zimbabwe W",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "2"
                },
                "back": [
                  {
                    "price": 4.0,
                    "size": 420
                  }
                ],
                "lay": [
                  {
                    "price": 4.04,
                    "size": 310
                  }
                ],
                "backPrice1": 4.0,
                "layPrice1": 4.04,
                "backSize1": 420,
                "laySize1": 310
              },
              {
                "handicap": 0,
                "selectionId": 3,
                "sortPriority": 3,
                "runnerName": "The Draw",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "3"
                },
                "back": [
                  {
                    "price": 7.5,
                    "size": 250
                  }
                ],
                "lay": [
                  {
                    "price": 7.7,
                    "size": 190
                  }
                ],
                "backPrice1": 7.5,
                "layPrice1": 7.7,
                "backSize1": 250,
                "laySize1": 190
              }
            ]
          }
        ],
        "BOOKMAKER": [
          {
            "marketId": "bookmaker-cricket-102",
            "marketName": "BOOKMAKER",
            "eventId": "cricket-102",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "BOOKMAKER",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 10,
            "maxRate": 40,
            "runners": [
              {
                "handicap": 0,
                "selectionId": 101,
                "sortPriority": 1,
                "runnerName": "India W",
                "status": "ACTIVE",
                "meta": null,
                "back": [
                  {
                    "price": 101.0,
                    "size": 350
                  }
                ],
                "lay": [
                  {
                    "price": 105.0,
                    "size": 270
                  }
                ],
                "backPrice1": 101.0,
                "layPrice1": 105.0,
                "backSize1": 350,
                "laySize1": 270
              },
              {
                "handicap": 0,
                "selectionId": 102,
                "sortPriority": 2,
                "runnerName": "Zimbabwe W",
                "status": "ACTIVE",
                "meta": null,
                "back": [
                  {
                    "price": 400.0,
                    "size": 420
                  }
                ],
                "lay": [
                  {
                    "price": 404.0,
                    "size": 310
                  }
                ],
                "backPrice1": 400.0,
                "layPrice1": 404.0,
                "backSize1": 420,
                "laySize1": 310
              }
            ]
          }
        ],
        "Tied Match": [
          {
            "marketId": "tied-match-cricket-102",
            "marketName": "Tied Match",
            "eventId": "cricket-102",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "Tied Match",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 1,
            "maxRate": 4,
            "runners": [
              {
                "handicap": 0,
                "selectionId": 201,
                "sortPriority": 1,
                "runnerName": "Yes",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "201"
                },
                "back": [
                  {
                    "price": 7.5,
                    "size": 100
                  }
                ],
                "lay": [
                  {
                    "price": 7.8,
                    "size": 100
                  }
                ],
                "backPrice1": 7.5,
                "layPrice1": 7.8,
                "backSize1": 100,
                "laySize1": 100
              },
              {
                "handicap": 0,
                "selectionId": 202,
                "sortPriority": 2,
                "runnerName": "No",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "202"
                },
                "back": [
                  {
                    "price": 1.2,
                    "size": 100
                  }
                ],
                "lay": [
                  {
                    "price": 1.3,
                    "size": 100
                  }
                ],
                "backPrice1": 1.2,
                "layPrice1": 1.3,
                "backSize1": 100,
                "laySize1": 100
              }
            ]
          }
        ]
      },
      "fancyMarkets": {
        "Normal": [
          {
            "marketId": "fancy-cricket-102-1",
            "marketName": "session",
            "marketCategory": "Normal",
            "gameType": "session",
            "gameStatus": "ACTIVE",
            "ballSession": "1",
            "sortPriority": 1,
            "gtStatus": "ACTIVE",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "remark": "",
            "runners": {
              "selectionId": 301,
              "runnerName": "India W total runs",
              "status": "ACTIVE",
              "backPrice1": 95,
              "layPrice1": 98,
              "backSize1": 100,
              "laySize1": 100
            }
          },
          {
            "marketId": "fancy-cricket-102-2",
            "marketName": "session",
            "marketCategory": "Normal",
            "gameType": "session",
            "gameStatus": "ACTIVE",
            "ballSession": "1",
            "sortPriority": 2,
            "gtStatus": "ACTIVE",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "remark": "",
            "runners": {
              "selectionId": 302,
              "runnerName": "Zimbabwe W total runs",
              "status": "ACTIVE",
              "backPrice1": 90,
              "layPrice1": 93,
              "backSize1": 100,
              "laySize1": 100
            }
          }
        ],
        "Over By Over": []
      }
    },
    "betConfig": {
      "minBetAmount": "100",
      "maxBetAmount": "10000",
      "sessionMinBetAmount": "100",
      "sessionMaxBetAmount": "10000",
      "fancyMinBetAmount": "100",
      "fancyMaxBetAmount": "100000",
      "bookmakerMinBetAmount": "100",
      "bookmakerMaxBetAmount": "10000",
      "minRate": "4",
      "maxRate": "4",
      "sessionMinRate": "75",
      "sessionMaxRate": "130",
      "fancyMinRate": "1",
      "fancyMaxRate": "4",
      "bookmakerMinRate": "10",
      "bookmakerMaxRate": "40",
      "type": "default"
    }
  },
  {
    "success": true,
    "message": "Catalogue fetched successfully",
    "catalogue": {
      "id": "football-101",
      "externalId": "football-101",
      "eventName": "Tosu v Kawasaki",
      "competitionId": 2,
      "competitionName": "Football Events",
      "startTime": "2026-10-28T12:15:00.000Z",
      "status": "Active",
      "sport": "Football",
      "inplay": true,
      "markets": {
        "Match Odds": [
          {
            "marketId": "match-odds-football-101",
            "marketName": "Match Odds",
            "eventId": "football-101",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "Match Odds",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 1,
            "maxRate": 4,
            "runners": [
              {
                "handicap": 0,
                "selectionId": 1,
                "sortPriority": 1,
                "runnerName": "Tosu",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "1"
                },
                "back": [
                  {
                    "price": 5.4,
                    "size": 350
                  }
                ],
                "lay": [
                  {
                    "price": 5.44,
                    "size": 270
                  }
                ],
                "backPrice1": 5.4,
                "layPrice1": 5.44,
                "backSize1": 350,
                "laySize1": 270
              },
              {
                "handicap": 0,
                "selectionId": 2,
                "sortPriority": 2,
                "runnerName": "Kawasaki",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "2"
                },
                "back": [
                  {
                    "price": 2.34,
                    "size": 420
                  }
                ],
                "lay": [
                  {
                    "price": 2.38,
                    "size": 310
                  }
                ],
                "backPrice1": 2.34,
                "layPrice1": 2.38,
                "backSize1": 420,
                "laySize1": 310
              },
              {
                "handicap": 0,
                "selectionId": 3,
                "sortPriority": 3,
                "runnerName": "The Draw",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "3"
                },
                "back": [
                  {
                    "price": 3.2,
                    "size": 250
                  }
                ],
                "lay": [
                  {
                    "price": 3.4,
                    "size": 190
                  }
                ],
                "backPrice1": 3.2,
                "layPrice1": 3.4,
                "backSize1": 250,
                "laySize1": 190
              }
            ]
          }
        ],
        "BOOKMAKER": [
          {
            "marketId": "bookmaker-football-101",
            "marketName": "BOOKMAKER",
            "eventId": "football-101",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "BOOKMAKER",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 10,
            "maxRate": 40,
            "runners": [
              {
                "handicap": 0,
                "selectionId": 101,
                "sortPriority": 1,
                "runnerName": "Tosu",
                "status": "ACTIVE",
                "meta": null,
                "back": [
                  {
                    "price": 540.0,
                    "size": 350
                  }
                ],
                "lay": [
                  {
                    "price": 544.0,
                    "size": 270
                  }
                ],
                "backPrice1": 540.0,
                "layPrice1": 544.0,
                "backSize1": 350,
                "laySize1": 270
              },
              {
                "handicap": 0,
                "selectionId": 102,
                "sortPriority": 2,
                "runnerName": "Kawasaki",
                "status": "ACTIVE",
                "meta": null,
                "back": [
                  {
                    "price": 234.0,
                    "size": 420
                  }
                ],
                "lay": [
                  {
                    "price": 238.0,
                    "size": 310
                  }
                ],
                "backPrice1": 234.0,
                "layPrice1": 238.0,
                "backSize1": 420,
                "laySize1": 310
              }
            ]
          }
        ],
        "Tied Match": [
          {
            "marketId": "tied-match-football-101",
            "marketName": "Tied Match",
            "eventId": "football-101",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "Tied Match",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 1,
            "maxRate": 4,
            "runners": [
              {
                "handicap": 0,
                "selectionId": 201,
                "sortPriority": 1,
                "runnerName": "Yes",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "201"
                },
                "back": [
                  {
                    "price": 3.2,
                    "size": 100
                  }
                ],
                "lay": [
                  {
                    "price": 3.5,
                    "size": 100
                  }
                ],
                "backPrice1": 3.2,
                "layPrice1": 3.5,
                "backSize1": 100,
                "laySize1": 100
              },
              {
                "handicap": 0,
                "selectionId": 202,
                "sortPriority": 2,
                "runnerName": "No",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "202"
                },
                "back": [
                  {
                    "price": 1.2,
                    "size": 100
                  }
                ],
                "lay": [
                  {
                    "price": 1.3,
                    "size": 100
                  }
                ],
                "backPrice1": 1.2,
                "layPrice1": 1.3,
                "backSize1": 100,
                "laySize1": 100
              }
            ]
          }
        ]
      },
      "fancyMarkets": {
        "Normal": [
          {
            "marketId": "fancy-football-101-1",
            "marketName": "session",
            "marketCategory": "Normal",
            "gameType": "session",
            "gameStatus": "ACTIVE",
            "ballSession": "1",
            "sortPriority": 1,
            "gtStatus": "ACTIVE",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "remark": "",
            "runners": {
              "selectionId": 301,
              "runnerName": "Tosu total points/games",
              "status": "ACTIVE",
              "backPrice1": 95,
              "layPrice1": 98,
              "backSize1": 100,
              "laySize1": 100
            }
          },
          {
            "marketId": "fancy-football-101-2",
            "marketName": "session",
            "marketCategory": "Normal",
            "gameType": "session",
            "gameStatus": "ACTIVE",
            "ballSession": "1",
            "sortPriority": 2,
            "gtStatus": "ACTIVE",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "remark": "",
            "runners": {
              "selectionId": 302,
              "runnerName": "Kawasaki total points/games",
              "status": "ACTIVE",
              "backPrice1": 90,
              "layPrice1": 93,
              "backSize1": 100,
              "laySize1": 100
            }
          }
        ],
        "Over By Over": []
      }
    },
    "betConfig": {
      "minBetAmount": "100",
      "maxBetAmount": "10000",
      "sessionMinBetAmount": "100",
      "sessionMaxBetAmount": "10000",
      "fancyMinBetAmount": "100",
      "fancyMaxBetAmount": "100000",
      "bookmakerMinBetAmount": "100",
      "bookmakerMaxBetAmount": "10000",
      "minRate": "4",
      "maxRate": "4",
      "sessionMinRate": "75",
      "sessionMaxRate": "130",
      "fancyMinRate": "1",
      "fancyMaxRate": "4",
      "bookmakerMinRate": "10",
      "bookmakerMaxRate": "40",
      "type": "default"
    }
  },
  {
    "success": true,
    "message": "Catalogue fetched successfully",
    "catalogue": {
      "id": "football-102",
      "externalId": "football-102",
      "eventName": "Mito v Cerezo Osaka",
      "competitionId": 2,
      "competitionName": "Football Events",
      "startTime": "2026-10-28T12:15:00.000Z",
      "status": "Active",
      "sport": "Football",
      "inplay": true,
      "markets": {
        "Match Odds": [
          {
            "marketId": "match-odds-football-102",
            "marketName": "Match Odds",
            "eventId": "football-102",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "Match Odds",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 1,
            "maxRate": 4,
            "runners": [
              {
                "handicap": 0,
                "selectionId": 1,
                "sortPriority": 1,
                "runnerName": "Mito",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "1"
                },
                "back": [
                  {
                    "price": 15,
                    "size": 350
                  }
                ],
                "lay": [
                  {
                    "price": 15.04,
                    "size": 270
                  }
                ],
                "backPrice1": 15,
                "layPrice1": 15.04,
                "backSize1": 350,
                "laySize1": 270
              },
              {
                "handicap": 0,
                "selectionId": 2,
                "sortPriority": 2,
                "runnerName": "Cerezo Osaka",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "2"
                },
                "back": [
                  {
                    "price": 1.37,
                    "size": 420
                  }
                ],
                "lay": [
                  {
                    "price": 1.41,
                    "size": 310
                  }
                ],
                "backPrice1": 1.37,
                "layPrice1": 1.41,
                "backSize1": 420,
                "laySize1": 310
              },
              {
                "handicap": 0,
                "selectionId": 3,
                "sortPriority": 3,
                "runnerName": "The Draw",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "3"
                },
                "back": [
                  {
                    "price": 4.7,
                    "size": 250
                  }
                ],
                "lay": [
                  {
                    "price": 4.9,
                    "size": 190
                  }
                ],
                "backPrice1": 4.7,
                "layPrice1": 4.9,
                "backSize1": 250,
                "laySize1": 190
              }
            ]
          }
        ],
        "BOOKMAKER": [
          {
            "marketId": "bookmaker-football-102",
            "marketName": "BOOKMAKER",
            "eventId": "football-102",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "BOOKMAKER",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 10,
            "maxRate": 40,
            "runners": [
              {
                "handicap": 0,
                "selectionId": 101,
                "sortPriority": 1,
                "runnerName": "Mito",
                "status": "ACTIVE",
                "meta": null,
                "back": [
                  {
                    "price": 1500,
                    "size": 350
                  }
                ],
                "lay": [
                  {
                    "price": 1504.0,
                    "size": 270
                  }
                ],
                "backPrice1": 1500,
                "layPrice1": 1504.0,
                "backSize1": 350,
                "laySize1": 270
              },
              {
                "handicap": 0,
                "selectionId": 102,
                "sortPriority": 2,
                "runnerName": "Cerezo Osaka",
                "status": "ACTIVE",
                "meta": null,
                "back": [
                  {
                    "price": 137.0,
                    "size": 420
                  }
                ],
                "lay": [
                  {
                    "price": 141.0,
                    "size": 310
                  }
                ],
                "backPrice1": 137.0,
                "layPrice1": 141.0,
                "backSize1": 420,
                "laySize1": 310
              }
            ]
          }
        ],
        "Tied Match": [
          {
            "marketId": "tied-match-football-102",
            "marketName": "Tied Match",
            "eventId": "football-102",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "Tied Match",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 1,
            "maxRate": 4,
            "runners": [
              {
                "handicap": 0,
                "selectionId": 201,
                "sortPriority": 1,
                "runnerName": "Yes",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "201"
                },
                "back": [
                  {
                    "price": 4.7,
                    "size": 100
                  }
                ],
                "lay": [
                  {
                    "price": 5.0,
                    "size": 100
                  }
                ],
                "backPrice1": 4.7,
                "layPrice1": 5.0,
                "backSize1": 100,
                "laySize1": 100
              },
              {
                "handicap": 0,
                "selectionId": 202,
                "sortPriority": 2,
                "runnerName": "No",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "202"
                },
                "back": [
                  {
                    "price": 1.2,
                    "size": 100
                  }
                ],
                "lay": [
                  {
                    "price": 1.3,
                    "size": 100
                  }
                ],
                "backPrice1": 1.2,
                "layPrice1": 1.3,
                "backSize1": 100,
                "laySize1": 100
              }
            ]
          }
        ]
      },
      "fancyMarkets": {
        "Normal": [
          {
            "marketId": "fancy-football-102-1",
            "marketName": "session",
            "marketCategory": "Normal",
            "gameType": "session",
            "gameStatus": "ACTIVE",
            "ballSession": "1",
            "sortPriority": 1,
            "gtStatus": "ACTIVE",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "remark": "",
            "runners": {
              "selectionId": 301,
              "runnerName": "Mito total points/games",
              "status": "ACTIVE",
              "backPrice1": 95,
              "layPrice1": 98,
              "backSize1": 100,
              "laySize1": 100
            }
          },
          {
            "marketId": "fancy-football-102-2",
            "marketName": "session",
            "marketCategory": "Normal",
            "gameType": "session",
            "gameStatus": "ACTIVE",
            "ballSession": "1",
            "sortPriority": 2,
            "gtStatus": "ACTIVE",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "remark": "",
            "runners": {
              "selectionId": 302,
              "runnerName": "Cerezo Osaka total points/games",
              "status": "ACTIVE",
              "backPrice1": 90,
              "layPrice1": 93,
              "backSize1": 100,
              "laySize1": 100
            }
          }
        ],
        "Over By Over": []
      }
    },
    "betConfig": {
      "minBetAmount": "100",
      "maxBetAmount": "10000",
      "sessionMinBetAmount": "100",
      "sessionMaxBetAmount": "10000",
      "fancyMinBetAmount": "100",
      "fancyMaxBetAmount": "100000",
      "bookmakerMinBetAmount": "100",
      "bookmakerMaxBetAmount": "10000",
      "minRate": "4",
      "maxRate": "4",
      "sessionMinRate": "75",
      "sessionMaxRate": "130",
      "fancyMinRate": "1",
      "fancyMaxRate": "4",
      "bookmakerMinRate": "10",
      "bookmakerMaxRate": "40",
      "type": "default"
    }
  },
  {
    "success": true,
    "message": "Catalogue fetched successfully",
    "catalogue": {
      "id": "tennis-101",
      "externalId": "tennis-101",
      "eventName": "H Dart v Tjen",
      "competitionId": 3,
      "competitionName": "Tennis Events",
      "startTime": "2026-10-28T12:10:00.000Z",
      "status": "Active",
      "sport": "Tennis",
      "inplay": true,
      "markets": {
        "Match Odds": [
          {
            "marketId": "match-odds-tennis-101",
            "marketName": "Match Odds",
            "eventId": "tennis-101",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "Match Odds",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 1,
            "maxRate": 4,
            "runners": [
              {
                "handicap": 0,
                "selectionId": 1,
                "sortPriority": 1,
                "runnerName": "H Dart",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "1"
                },
                "back": [
                  {
                    "price": 1.17,
                    "size": 350
                  }
                ],
                "lay": [
                  {
                    "price": 1.21,
                    "size": 270
                  }
                ],
                "backPrice1": 1.17,
                "layPrice1": 1.21,
                "backSize1": 350,
                "laySize1": 270
              },
              {
                "handicap": 0,
                "selectionId": 2,
                "sortPriority": 2,
                "runnerName": "Tjen",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "2"
                },
                "back": [
                  {
                    "price": 6.6,
                    "size": 420
                  }
                ],
                "lay": [
                  {
                    "price": 6.64,
                    "size": 310
                  }
                ],
                "backPrice1": 6.6,
                "layPrice1": 6.64,
                "backSize1": 420,
                "laySize1": 310
              }
            ]
          }
        ]
      },
      "fancyMarkets": {
        "Normal": [
          {
            "marketId": "fancy-tennis-101-1",
            "marketName": "session",
            "marketCategory": "Normal",
            "gameType": "session",
            "gameStatus": "ACTIVE",
            "ballSession": "1",
            "sortPriority": 1,
            "gtStatus": "ACTIVE",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "remark": "",
            "runners": {
              "selectionId": 301,
              "runnerName": "H Dart total points/games",
              "status": "ACTIVE",
              "backPrice1": 95,
              "layPrice1": 98,
              "backSize1": 100,
              "laySize1": 100
            }
          },
          {
            "marketId": "fancy-tennis-101-2",
            "marketName": "session",
            "marketCategory": "Normal",
            "gameType": "session",
            "gameStatus": "ACTIVE",
            "ballSession": "1",
            "sortPriority": 2,
            "gtStatus": "ACTIVE",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "remark": "",
            "runners": {
              "selectionId": 302,
              "runnerName": "Tjen total points/games",
              "status": "ACTIVE",
              "backPrice1": 90,
              "layPrice1": 93,
              "backSize1": 100,
              "laySize1": 100
            }
          }
        ],
        "Over By Over": []
      }
    },
    "betConfig": {
      "minBetAmount": "100",
      "maxBetAmount": "10000",
      "sessionMinBetAmount": "100",
      "sessionMaxBetAmount": "10000",
      "fancyMinBetAmount": "100",
      "fancyMaxBetAmount": "100000",
      "bookmakerMinBetAmount": "100",
      "bookmakerMaxBetAmount": "10000",
      "minRate": "4",
      "maxRate": "4",
      "sessionMinRate": "75",
      "sessionMaxRate": "130",
      "fancyMinRate": "1",
      "fancyMaxRate": "4",
      "bookmakerMinRate": "10",
      "bookmakerMaxRate": "40",
      "type": "default"
    }
  },
  {
    "success": true,
    "message": "Catalogue fetched successfully",
    "catalogue": {
      "id": "tennis-102",
      "externalId": "tennis-102",
      "eventName": "Alela v Ta Gibson",
      "competitionId": 3,
      "competitionName": "Tennis Events",
      "startTime": "2026-10-28T12:20:00.000Z",
      "status": "Active",
      "sport": "Tennis",
      "inplay": true,
      "markets": {
        "Match Odds": [
          {
            "marketId": "match-odds-tennis-102",
            "marketName": "Match Odds",
            "eventId": "tennis-102",
            "inplay": true,
            "status": "ACTIVE",
            "marketType": "Match Odds",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "minRate": 1,
            "maxRate": 4,
            "runners": [
              {
                "handicap": 0,
                "selectionId": 1,
                "sortPriority": 1,
                "runnerName": "Alela",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "1"
                },
                "back": [
                  {
                    "price": 1.6,
                    "size": 350
                  }
                ],
                "lay": [
                  {
                    "price": 1.64,
                    "size": 270
                  }
                ],
                "backPrice1": 1.6,
                "layPrice1": 1.64,
                "backSize1": 350,
                "laySize1": 270
              },
              {
                "handicap": 0,
                "selectionId": 2,
                "sortPriority": 2,
                "runnerName": "Ta Gibson",
                "status": "ACTIVE",
                "meta": {
                  "runnerId": "2"
                },
                "back": [
                  {
                    "price": 2.64,
                    "size": 420
                  }
                ],
                "lay": [
                  {
                    "price": 2.68,
                    "size": 310
                  }
                ],
                "backPrice1": 2.64,
                "layPrice1": 2.68,
                "backSize1": 420,
                "laySize1": 310
              }
            ]
          }
        ]
      },
      "fancyMarkets": {
        "Normal": [
          {
            "marketId": "fancy-tennis-102-1",
            "marketName": "session",
            "marketCategory": "Normal",
            "gameType": "session",
            "gameStatus": "ACTIVE",
            "ballSession": "1",
            "sortPriority": 1,
            "gtStatus": "ACTIVE",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "remark": "",
            "runners": {
              "selectionId": 301,
              "runnerName": "Alela total points/games",
              "status": "ACTIVE",
              "backPrice1": 95,
              "layPrice1": 98,
              "backSize1": 100,
              "laySize1": 100
            }
          },
          {
            "marketId": "fancy-tennis-102-2",
            "marketName": "session",
            "marketCategory": "Normal",
            "gameType": "session",
            "gameStatus": "ACTIVE",
            "ballSession": "1",
            "sortPriority": 2,
            "gtStatus": "ACTIVE",
            "minBetAmount": 100,
            "maxBetAmount": 10000,
            "type": "sport",
            "remark": "",
            "runners": {
              "selectionId": 302,
              "runnerName": "Ta Gibson total points/games",
              "status": "ACTIVE",
              "backPrice1": 90,
              "layPrice1": 93,
              "backSize1": 100,
              "laySize1": 100
            }
          }
        ],
        "Over By Over": []
      }
    },
    "betConfig": {
      "minBetAmount": "100",
      "maxBetAmount": "10000",
      "sessionMinBetAmount": "100",
      "sessionMaxBetAmount": "10000",
      "fancyMinBetAmount": "100",
      "fancyMaxBetAmount": "100000",
      "bookmakerMinBetAmount": "100",
      "bookmakerMaxBetAmount": "10000",
      "minRate": "4",
      "maxRate": "4",
      "sessionMinRate": "75",
      "sessionMaxRate": "130",
      "fancyMinRate": "1",
      "fancyMaxRate": "4",
      "bookmakerMinRate": "10",
      "bookmakerMaxRate": "40",
      "type": "default"
    }
  }
];

export default matchCatalogues;
