import { WebzIntegrationService } from './services/WebzIntegrationService';
import { logger } from './utils/logger';

(async () => {
    const service = new WebzIntegrationService();
    try {
        await service.syncPosts();
    } catch (error) {
        logger.error('Sync failed: ' + error);
    }
})();
