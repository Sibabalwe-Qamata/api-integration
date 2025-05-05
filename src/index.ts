import express from 'express';
import { WebzIntegrationService } from './services/WebzIntegrationService';
import { PostgresService } from './database/PostgresService';
import { logger } from './utils/logger';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
const dbService = new PostgresService();

const integrationService = new WebzIntegrationService();


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/sync', async (req, res) => {
  try {
    logger.info('Starting sync process via API endpoint');
    

    syncPosts().catch(error => {
      logger.error(`Sync failed: ${error}`);
    });
    
    res.status(202).json({ 
      message: 'Sync process started', 
      status: 'processing',
      startTime: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error(`Error initiating sync: ${error.message}`);
    res.status(500).json({ error: 'Failed to start sync process' });
  }
});


async function syncPosts() {
  try {
    await integrationService.syncPosts();
    logger.info('Sync completed successfully');
    return true;
  } catch (error) {
    logger.error(`Sync process failed: ${error}`);
    return false;
  }
}

(async () => {
  try {

    const connected = await dbService.testConnection();
    if (connected) {
      await dbService.createPostsTable();
      logger.info('Database initialized successfully');
      
 
      app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
        logger.info(`Health check: http://localhost:${port}/health`);
        logger.info(`Sync endpoint: POST http://localhost:${port}/api/sync`);
      });
    } else {
      logger.error('Failed to connect to database');
      process.exit(1);
    }
  } catch (error) {
    logger.error(`Startup failed: ${error}`);
    process.exit(1);
  }
})();