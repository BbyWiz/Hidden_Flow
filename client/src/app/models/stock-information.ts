export interface HistoryInfo {
  count: number;
  firstDate?: string;
  lastDate?: string;
}

export interface LatestBar {
  date?: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface QuoteInfo {
  regularMarketPrice?: number;
  currency?: string;
  trailingPE?: number | null;
  forwardPE?: number | null;
}

export interface Indicators {
  smaWindow?: number;
  sma?: number | null;
  rsiPeriod?: number;
  rsi?: number | null;
  pe?: number | null;
}

export interface Rules {
  aboveSMA?: boolean | null;
  belowSMA?: boolean | null;
  oversold?: boolean | null;
  overbought?: boolean | null;
  cheapPE?: boolean | null;
  expensivePE?: boolean | null;
}

export interface stockInformation {
  symbol: string;
  history?: HistoryInfo;
  latestBar?: LatestBar;
  quote?: QuoteInfo;
  indicators?: Indicators;
  rules?: Rules;
  summary?: string;
}