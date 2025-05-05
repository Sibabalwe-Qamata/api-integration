import { WebzApiClient } from '../api/WebzApiClient';
import { PostgresService } from '../database/PostgresService';
import { InMemoryCache } from '../cache/InMemoryCache';
import { logger } from '../utils/logger';

export class WebzIntegrationService {
    private apiClient = new WebzApiClient();
    private dbService = new PostgresService();
    private cache = new InMemoryCache<any[]>();

    async syncPosts() {
        let nextToken: string | undefined = undefined;
        let totalSaved = 0;
        let totalResults = 0;

        do {
            try {
                const response = await this.apiClient.fetchPosts(nextToken);
                totalResults = response.totalResults;
                logger.info(`Fetched ${response.posts.length} posts`);
                await this.dbService.savePosts(response.posts);
                totalSaved += response.posts.length;
                logger.info(`Saved ${totalSaved}/${totalResults} posts`);
                logger.info(`Response : ${JSON.stringify(response)}`);
                nextToken = response.moreResultsAvailable ? response.posts.at(-1)?.uuid : undefined;
            } catch (error) {
                logger.error('Error during sync, caching posts to resume later.');
                this.cache.set(this.cache.get() || []);
                throw error;
            }
        } while (nextToken && totalSaved < totalResults);

        logger.info(`Completed fetching posts. Total saved: ${totalSaved}`);
    }
}
