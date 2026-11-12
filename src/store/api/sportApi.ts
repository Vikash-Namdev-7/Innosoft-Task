import { apiSlice } from './apiSlice';

// Runner Type
export interface Runner {
  handicap?: number;
  selectionId: number;
  sortPriority?: number;
  runnerName: string;
  status: string;

  meta?: {
    runnerId: string;
  } | null;

  back?: {
    price: number;
    size: number;
  }[];

  lay?: {
    price: number;
    size: number;
  }[];

  backPrice1?: number;
  backPrice2?: number;
  backPrice3?: number;

  layPrice1?: number;
  layPrice2?: number;
  layPrice3?: number;

  backSize1?: number;
  backSize2?: number;
  backSize3?: number;

  laySize1?: number;
  laySize2?: number;
  laySize3?: number;
}


export interface CatalogueMarket {
  marketId: string;
  marketName: string;
  eventId: string;
  inplay: boolean;
  marketStartTime?: string;
  status: string;
  marketType: string;
  runners: Runner[];
  maxBetAmount?: number;
  minBetAmount?: number;
  type?: string;
  minRate?: number;
  maxRate?: number;
}


export interface FancyOdds {
  price: number;
  size: number;
}

export interface FancyRunner {
  selectionId: string | number;
  runnerName: string;
  status: string;

  back: FancyOdds[];
  lay: FancyOdds[];
}

export interface FancyMarket {
  marketId: string;
  marketName: string;
  marketCategory?: string;
  gameType?: string;
  gameStatus?: string;
  ballSession?: string;
  sortPriority?: number;
  gtStatus?: string;
  minBetAmount?: number;
  maxBetAmount?: number;
  type?: string;
  remark?: string;

  runners: FancyRunner;
}


export interface BetConfig {
  minBetAmount: string;
  maxBetAmount: string;
  sessionMinBetAmount: string;
  sessionMaxBetAmount: string;
  fancyMinBetAmount: string;
  fancyMaxBetAmount: string;
  bookmakerMinBetAmount: string;
  bookmakerMaxBetAmount: string;
  minRate: string;
  maxRate: string;
  sessionMinRate: string;
  sessionMaxRate: string;
  fancyMinRate: string;
  fancyMaxRate: string;
  bookmakerMinRate: string;
  bookmakerMaxRate: string;
  type: string;
}

export interface Catalogue {
  id: string;
  externalId: string;
  eventName: string;
  competitionId: number;
  competitionName: string;
  startTime: string;
  status: string;
  sport: string;
  inplay: boolean;

  markets: Record<string, CatalogueMarket[]>;

  fancyMarkets: Record<string, FancyMarket[]>;
}

export interface CatalogueResponse {
  success: boolean;
  message: string;
  catalogue: Catalogue;
  betConfig: BetConfig;
}


// Competition Type
export interface Competition {
  id: number;
  name: string;
  externalId: string;
}

export interface Fixture {
  id: number;
  competitionId: number;
  providerId: number | null;
  externalId: string;

  name: string;
  sport: string;
  startTime: string;
  status: string;
  inplay: boolean;

  isBookmaker: boolean;
  isFancy: boolean;
  isManual: boolean;
  isPopular: boolean;
  isPremiumFancy: boolean;

  marketExternalId: string;
  marketId: string;

  runners: Runner[];

  competition: Competition;
}


// API Response Type
export interface FixtureResponse {
  success: boolean;
  message: string;
  fixture: Fixture[];
}

export interface FixtureQuery {
  sport?: string;
  inplay?: boolean;
  status?: string;
}


export const sportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFixtures: builder.query<FixtureResponse, FixtureQuery>({
      query: ({ sport, inplay, status }) => ({
        url: '/fixture',
        method: 'GET',
        params: {
          ...(sport && { sport }),
          ...(inplay !== undefined && { inplay }),
          ...(status && { status }),
        },
      }),
    }),

    getCatalogue: builder.query<CatalogueResponse, string>({
        query: (fixtureId) => ({
            url: `/catalogue/${fixtureId}`,
            method: 'GET',
        })
    })
  }),
});

export const { useGetFixturesQuery, useGetCatalogueQuery } = sportApi;
