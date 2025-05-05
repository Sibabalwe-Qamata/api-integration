import { WebzApiClient } from '../api/WebzApiClient';
import { PostgresService } from '../database/PostgresService';
import { InMemoryCache } from '../cache/InMemoryCache';
import { logger } from '../utils/logger';

export class WebzIntegrationService {
    private apiClient = new WebzApiClient();
    private dbService = new PostgresService();
    private cache = new InMemoryCache<any[]>();
    
    /**
     * Synchronizes posts from Webz.io API to database
     * @param maxPosts Maximum number of posts to fetch (0 for all available)
     * @returns Number of posts successfully saved
     */
    async syncPosts(maxPosts: number = 0): Promise<number> {
        let nextPath: string | undefined = undefined;
        let totalSaved = 0;
        let totalResults = 0;
        let hasMoreResults = true;
        let processedIds = new Set<string>(); 
        
       
        while (hasMoreResults && (maxPosts === 0 || totalSaved < maxPosts)) {
            try {
               
                const response = await this.apiClient.fetchPosts(nextPath);
                
                
                totalResults = response.totalResults || 0;
                
               
                const uniquePosts = response.posts.filter(post => {
                   
                    if (!post.uuid) {
                        logger.warn('Post missing UUID, skipping');
                        return false;
                    }
                    
                 
                    if (processedIds.has(post.uuid)) {
                        logger.info(`Skipping duplicate post: ${post.uuid}`);
                        return false;
                    }
                    
                  
                    processedIds.add(post.uuid);
                    return true;
                });
                
                
                if (uniquePosts.length > 0) {
                    await this.dbService.savePosts(uniquePosts);
                    totalSaved += uniquePosts.length;
                }
                
                logger.info(`Saved ${totalSaved}/${totalResults} posts (${uniquePosts.length} unique in this batch)`);
                
               
                hasMoreResults = Boolean(response.moreResultsAvailable && response.next);
                nextPath = response.next;
                
         
                if (maxPosts > 0 && totalSaved >= maxPosts) {
                    logger.info(`Reached maximum posts limit of ${maxPosts}`);
                    break;
                }
                
               
                if (!hasMoreResults) {
                    logger.info('No more results available');
                    break;
                }
                
            } catch (error) {
                logger.error('Error during sync: ' + error);
                
                this.cache.set(Array.from(processedIds));
                
                throw new Error(`Failed to sync posts after processing ${totalSaved} posts: ${error}`);
            }
        }
        
        logger.info(`Completed fetching posts. Total saved: ${totalSaved}`);
        return totalSaved;
    }
    
    /**
     * Resume a previously interrupted sync operation
     * @param maxPosts Maximum number of posts to fetch (0 for all available)
     * @returns Number of posts successfully saved
     */
    async resumeSync(maxPosts: number = 0): Promise<number> {
     
        const processedIds = new Set<string>(this.cache.get() || []);
        
        if (processedIds.size === 0) {
            logger.info('No previous sync state found, starting fresh sync');
            return this.syncPosts(maxPosts);
        }
        
        logger.info(`Resuming sync with ${processedIds.size} previously processed posts`);
        
     
        let nextPath: string | undefined = undefined;
        let totalSaved = processedIds.size; 
        let totalResults = 0;
        let hasMoreResults = true;
        
        while (hasMoreResults && (maxPosts === 0 || totalSaved < maxPosts)) {
            try {
                const response = await this.apiClient.fetchPosts(nextPath);
                totalResults = response.totalResults || 0;
                
                const uniquePosts = response.posts.filter(post => {
                    if (!post.uuid) {
                        logger.warn('Post missing UUID, skipping');
                        return false;
                    }
                    
                    if (processedIds.has(post.uuid)) {
                        logger.info(`Skipping already processed post: ${post.uuid}`);
                        return false;
                    }
                    
                    processedIds.add(post.uuid);
                    return true;
                });
                
                if (uniquePosts.length > 0) {
                    await this.dbService.savePosts(uniquePosts);
                    totalSaved += uniquePosts.length;
                }
                
                logger.info(`Resumed sync: ${totalSaved}/${totalResults} posts (${uniquePosts.length} unique in this batch)`);
                
                hasMoreResults = Boolean(response.moreResultsAvailable && response.next);
                nextPath = response.next;
                
                if (maxPosts > 0 && totalSaved >= maxPosts) {
                    logger.info(`Reached maximum posts limit of ${maxPosts}`);
                    break;
                }
                
            } catch (error) {
                logger.error('Error during resumed sync: ' + error);
                this.cache.set(Array.from(processedIds));
                throw new Error(`Failed to resume sync after processing ${totalSaved} posts: ${error}`);
            }
        }
        
        
        this.cache.clear();
        logger.info(`Completed resumed sync. Total saved: ${totalSaved}`);
        return totalSaved;
    }
}