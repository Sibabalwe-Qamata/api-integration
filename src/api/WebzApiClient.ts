import axios from 'axios';
import { env } from '../config/env';
import { WebzResponse } from '../types/WebzTypes';
import { logger } from '../utils/logger';
import { WebzQueryBuilder } from '../query/WebzQueryBuilder';

export class WebzApiClient {
    /**
     * Fetches posts from the Webz.io API
     * @param nextPath Optional next path for pagination (from previous response)
     * @returns WebzResponse containing posts and pagination info
     */
    async fetchPosts(nextPath?: string): Promise<WebzResponse> {
        try {
            let url = `${env.WEBZ_BASE_URL}/newsApiLite`;
            let params: Record<string, any> = {};
            
            if (nextPath) {
             
                const nextUrl = new URL(nextPath.startsWith('http') ? nextPath : `http://example.com${nextPath}`);
                url = `${env.WEBZ_BASE_URL}${nextUrl.pathname}`;
                
                nextUrl.searchParams.forEach((value, key) => {
                    params[key] = value;
                });
                
             
                params.token = env.WEBZ_API_KEY;
            } else {
            
                const query = "bitcoin"; 
                
                params = {
                    token: env.WEBZ_API_KEY,
                    format: 'json',
                    q: query,
                    size: 100 
                };
            }
            
            logger.info(`Fetching posts from: ${url} with params: ${JSON.stringify(params)}`);
            
            const response = await axios.get(url, {
                params,
                timeout: env.REQUEST_TIMEOUT_MS,
            });
            
            logger.info(`Received ${response.data.posts?.length || 0} posts`);
            return response.data as WebzResponse;
        } catch (error) {
            logger.error('API Request failed: ' + error);
            throw new Error('Failed to fetch posts from Webz.io');
        }
    }
}