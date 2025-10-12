export interface Insight {
  ticker: string;
  bullet: string;
  horizon: string;
  conviction: string;
  recommendation: string;
}

export interface WatchlistItem {
  ticker: string;
  why: string;
  horizon: string;
  recommendation: string;
}

export interface Source {
  url: string;
  note: string;
}

export interface BriefContent {
  summary: string;
  insights: Insight[];
  watchlist: WatchlistItem[];
  sources: Source[];
}

export interface Brief {
  id: string;
  date: string;
  subject: string;
  json: BriefContent;
  html?: string;
  text?: string;
}

export type ConvictionLevel = 'low' | 'medium' | 'high';
export type HorizonType = 'short-term' | 'long-term' | 'uncertain';

