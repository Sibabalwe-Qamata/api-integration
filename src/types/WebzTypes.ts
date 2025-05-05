export interface WebzResponse {
    posts: any[];
    moreResultsAvailable: boolean;
    totalResults: number;
}
export interface WebzPost {
    uuid: string;
    title: string;
    url: string;
    date: string;
    source: string;
    content: string;
    tags: string[];
}
export interface WebzError {
    error: string;
    message: string;
}
export interface WebzConfig { 
    apiKey: string;
    baseUrl: string;
    fetchQuery: string;
    requestTimeoutMs: number;
    dbHost: string;
    dbPort: number;
    dbUser: string;
 }