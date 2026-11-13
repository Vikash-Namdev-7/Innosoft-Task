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
  minRate?: number;
  maxRate?: number;

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

export interface ScorecardResponse {
  success: boolean;
  message: string;
  scorecardUrl: string | null;
  liveTvUrl: string | null;
}

export interface PlaceBetRequest {
  eventId: number;
  marketId: string;
  marketName: string;
  marketCategory?: string;
  marketType: string;
  selectionId: string;
  runnerName: string;
  stake: number;
  rate: number;
  position: number;
  fancyPercentage?: number;
  betOn: 'BACK' | 'LAY';
  acceptOddsChange?: string;
}

export interface PlaceBetResponse {
  success: boolean;
  message: string;
  data?: unknown;
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


// For Exposure Calculation 
export interface BooksetSelection {
  selectionId: string | number;
  exposure: number;
}

export interface BooksetMarket {
  marketId: number | string;
  marketExternalId?: string;
  selections: BooksetSelection[];
}

export type BooksetCalculationResponse = BooksetMarket[];

// Bet History Types
export interface BetHistoryItem {
  id: string;
  userId?: string;
  eventId: string | number;
  sport: string;
  marketId: string;
  marketName: string;
  marketCategory?: string;
  marketType?: string;
  amount: string | number;
  bonusUsages?: string | number;
  odds: string | number;
  percentage?: number | null;
  betOn: 'Back' | 'Lay' | 'BACK' | 'LAY';
  selection: string;
  selectionId: string | number;
  payout?: string | number;
  status: string; // 'Pending' | 'Won' | 'Lost' | 'Void' | 'Settled' | 'OPEN' | 'CANCELLED'
  isBookmaker?: boolean;
  placedAt: string;
  settledAt?: string | null;
  ip?: string;
  isTurnOverCalculated?: boolean;
  isPlCalculated?: boolean;
  event?: {
    id: string | number;
    name: string;
    externalId?: string;
  };
  liability?: number;
  potentialProfit?: number;
  profitLoss?: number;
}

export interface BetHistoryPagination {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPage: number;
}

export interface BetHistoryResponse {
  success: boolean;
  message: string;
  bets: BetHistoryItem[];
  pagination: BetHistoryPagination;
}

export interface BetHistoryQuery {
  page?: number;
  limit?: number;
  betTime: 'CURRENT' | 'PAST';
  eventId?: number | string;
  fromDate?: string;
  toDate?: string;
  sport?: string;
  t?: number;
}

// Popular Events Response Type
export interface PopularEventsResponse {
  success: boolean;
  message: string;
  events: Fixture[];
}

export function normalizePopularEvent(raw: any): Fixture {
  return {
    id: Number(raw?.id ?? raw?.eventId ?? 0),
    competitionId: Number(raw?.competitionId ?? raw?.competition?.id ?? 0),
    providerId: raw?.providerId ?? null,
    externalId: String(raw?.externalId ?? raw?.id ?? ''),
    name: String(raw?.name ?? raw?.eventName ?? 'Unknown Match'),
    sport: String(raw?.sport ?? raw?.sportName ?? 'Cricket'),
    startTime: String(raw?.startTime ?? new Date().toISOString()),
    status: String(raw?.status ?? 'ACTIVE'),
    inplay: Boolean(raw?.inplay),
    isBookmaker: Boolean(raw?.isBookmaker),
    isFancy: Boolean(raw?.isFancy),
    isManual: Boolean(raw?.isManual),
    isPopular: Boolean(raw?.isPopular ?? true),
    isPremiumFancy: Boolean(raw?.isPremiumFancy),
    marketExternalId: String(raw?.marketExternalId ?? ''),
    marketId: String(raw?.marketId ?? ''),
    runners: Array.isArray(raw?.runners) ? raw.runners : [],
    competition: raw?.competition ?? {
      id: Number(raw?.competitionId ?? 0),
      name: String(raw?.competitionName ?? ''),
      externalId: '',
    },
  };
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


export interface StakeSetItem {
  id: number;
  label: string;
  value: number;
}

export function parseStakeSetResponse(data: any): StakeSetItem[] | null {
  if (!data) return null;

  let rawList: any[] | null = null;
  if (Array.isArray(data)) {
    rawList = data;
  } else if (Array.isArray(data?.data)) {
    rawList = data.data;
  } else if (Array.isArray(data?.stakes)) {
    rawList = data.stakes;
  } else if (Array.isArray(data?.result)) {
    rawList = data.result;
  } else if (Array.isArray(data?.stake)) {
    rawList = data.stake;
  } else if (typeof data === 'object' && data !== null) {
    const list: StakeSetItem[] = [];
    Object.keys(data).forEach((key, idx) => {
      const val = data[key];
      if (typeof val === 'number') {
        list.push({ id: idx + 1, label: String(val), value: val });
      } else if (typeof val === 'object' && val !== null && (val.value !== undefined || val.stake !== undefined)) {
        const numVal = Number(val.value ?? val.stake ?? 0);
        const lbl = String(val.label ?? val.name ?? numVal);
        list.push({ id: idx + 1, label: lbl, value: numVal });
      }
    });
    if (list.length > 0) return list;
  }

  if (rawList && rawList.length > 0) {
    return rawList.map((item, idx) => {
      if (typeof item === 'number') {
        return {
          id: idx + 1,
          label: String(item),
          value: item,
        };
      }
      if (typeof item === 'string') {
        const num = Number(item) || 0;
        return {
          id: idx + 1,
          label: item,
          value: num,
        };
      }
      if (typeof item === 'object' && item !== null) {
        const val = Number(item.value ?? item.stake ?? item.amount ?? item.label ?? 0);
        const lbl = String(item.label ?? item.name ?? item.value ?? item.stake ?? val);
        return {
          id: item.id ? Number(item.id) || idx + 1 : idx + 1,
          label: lbl,
          value: val,
        };
      }
      return {
        id: idx + 1,
        label: String(item),
        value: Number(item) || 0,
      };
    });
  }

  return null;
}

export const marketApi = apiSlice.injectEndpoints({
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
    }),

    getScorecard: builder.query<ScorecardResponse, string>({
        query: (eventId) => ({
            url: `/events/scorecard/${eventId}`,
            method: 'GET',
        }),
    }),

    placeBet: builder.mutation<PlaceBetResponse, PlaceBetRequest>({
      query: (body) => ({
        url: '/bet/place',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BetHistory', 'UserDetails', 'Bookset', 'Transactions'],
    }),

    getStakeset: builder.query<any, void>({
      query: () => ({
        url: '/stakeset',
        method: 'GET',
        params: {
          t: Date.now(),
        },
      }),
      providesTags: ['StakeSet'],
    }),

    updateStakeset: builder.mutation<any, any>({
      query: (body) => ({
        url: '/stakeset',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StakeSet'],
    }),


    // For Exposure Calculate 
    getBooksetCalculation: builder.query<
      BooksetMarket[],
      number | string
    >({
      query: (eventId) => ({
        url: '/exposure/bookset/calculation',
        method: 'GET',
        params: {
          eventId,
        },
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return response;
        }
        if (Array.isArray(response?.data)) {
          return response.data;
        }
        if (Array.isArray(response?.result)) {
          return response.result;
        }
        return [];
      },
      providesTags: ['Bookset'],
    }),

    // Popular Events
    getPopularEvents: builder.query<PopularEventsResponse, void>({
      query: () => ({
        url: '/events/popular',
        method: 'GET',
        params: {
          t: Date.now(),
        },
      }),
      transformResponse: (response: any) => {
        let events: Fixture[] = [];
        if (Array.isArray(response)) {
          events = response;
        } else if (Array.isArray(response?.events)) {
          events = response.events;
        } else if (Array.isArray(response?.data)) {
          events = response.data;
        } else if (Array.isArray(response?.result)) {
          events = response.result;
        }

        return {
          success: Boolean(response?.success ?? true),
          message: String(response?.message ?? 'Popular event fetched successfully'),
          events,
        };
      },
      providesTags: ['Events'],
    }),

    // Bet History
    getBetHistory: builder.query<BetHistoryResponse, BetHistoryQuery>({
      query: (params) => {
        const queryParams: Record<string, any> = {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          betTime: params.betTime,
          t: params.t ?? Date.now(),
        };
        if (params.eventId !== undefined && params.eventId !== '') {
          queryParams.eventId = Number(params.eventId);
        }
        if (params.fromDate) queryParams.fromDate = params.fromDate;
        if (params.toDate) queryParams.toDate = params.toDate;
        if (params.sport && params.sport !== 'All') queryParams.sport = params.sport;

        return {
          url: '/bet/history',
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: ['BetHistory'],
    }),
  }),
});

export const {
  useGetFixturesQuery,
  useGetCatalogueQuery,
  useGetScorecardQuery,
  usePlaceBetMutation,
  useGetStakesetQuery,
  useUpdateStakesetMutation,
  useGetBooksetCalculationQuery,
  useGetPopularEventsQuery,
  useGetBetHistoryQuery,
} = marketApi;
