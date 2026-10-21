export type ApiCategory =
  | 'ai-ml'
  | 'image-to-video'
  | 'text-language'
  | 'image-vision'
  | 'audio-speech'
  | 'developer-tools'
  | 'adult-uncensored';

export interface CodeSnippets {
  curl: string;
  javascript: string;
  python: string;
}

export interface FreeApiItem {
  id: string;
  name: string;
  provider: string;
  category: ApiCategory;
  isAdult?: boolean;
  tags: string[];
  shortDescription: string;
  fullDescription: string;
  rateLimit: string;
  authType: 'API Key' | 'Bearer Token' | 'No Auth' | 'OAuth 2.0';
  costType: '100% Free' | 'Free Tier' | 'Free Credits / Mo';
  requiresCreditCard: boolean;
  websiteUrl: string;
  docsUrl: string;
  endpointUrl: string;
  method?: 'GET' | 'POST' | 'GRAPHQL';
  responseExample: Record<string, any> | string;
  codeSnippets: CodeSnippets;
  keySteps: string[];
  status: 'ONLINE' | 'ACTIVE' | 'HIGH LOAD';
  umbrellaSecurityLevel: 'PUBLIC' | 'LEVEL 1' | 'LEVEL 2' | 'LEVEL 4 BIO-RESTRICTED';
  addedDate: string;
}

export interface RadarNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  timestamp: number;
  read: boolean;
  category?: string;
  apiId?: string;
}

export type IconAnimationState = 'idle' | 'pulse' | 'rotate' | 'flare' | 'ready';
