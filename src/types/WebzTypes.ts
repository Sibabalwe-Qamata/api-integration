export interface WebzPost {
    uuid: string;
    url: string;
    title: string;
    text: string;
    published: string;
    author: string;
    sentiment: string;
    language?: string;
    ord_in_thread?: number;
    parent_url?: string | null;
    highlightText?: string;
    highlightTitle?: string;
    highlightThreadTitle?: string;
    categories?: string[];
    external_links?: string[];
    external_images?: string[];
    entities?: {
        persons?: Array<{ name: string; sentiment: string }>;
        organizations?: Array<{ name: string; sentiment: string }>;
        locations?: Array<{ name: string; sentiment: string }>;
    };
    rating?: any;
    crawled?: string;
    updated?: string;
    thread?: {
        uuid?: string;
        url?: string;
        site_full?: string;
        site?: string;
        site_section?: string;
        site_categories?: string[];
        section_title?: string;
        title?: string;
        title_full?: string;
        published?: string;
        replies_count?: number;
        participants_count?: number;
        site_type?: string;
        country?: string;
        main_image?: string;
        performance_score?: number;
        domain_rank?: number;
        domain_rank_updated?: string;
        social?: any;
    };
}

export interface WebzResponse {
    posts: WebzPost[];
    totalResults: number;
    moreResultsAvailable: number;
    next: string;
    requestsLeft: number;
    warnings: any;
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