import axios from 'axios';
import { env } from '../config/env';
import { WebzResponse } from '../types/WebzTypes';
import { logger } from '../utils/logger';
import { WebzQueryBuilder } from '../query/WebzQueryBuilder';

export class WebzApiClient {
    async fetchPosts(next?: string): Promise<WebzResponse> {
        //const query:any = new WebzQueryBuilder()
            // .withSearchTerm("climate change") // <- Example
            // .withSiteType("news")
            // .withLanguage("english")
            // .build();
            const query = "climate change"; // <- Example

        const params: Record<string, any> = {
            token: env.WEBZ_API_KEY,
            format: 'json',
            q:query
        };

        if (next) params.next = next;
        try {
            const response = await axios.get(`${env.WEBZ_BASE_URL}/newsApiLite`, {
                params,
                timeout: env.REQUEST_TIMEOUT_MS,
            });
            return response.data as WebzResponse;
        } catch (error) {
            logger.error('API Request failed: ' + error);
            throw new Error('Failed to fetch posts from Webz.io');
        }
    }
}
