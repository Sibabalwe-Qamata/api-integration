import { WebzApiClient } from '../src/api/WebzApiClient';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WebzApiClient', () => {
    it('should fetch posts successfully', async () => {
        mockedAxios.get.mockResolvedValue({ data: { posts: [], moreResultsAvailable: false, totalResults: 0 } });

        const client = new WebzApiClient();
        const response = await client.fetchPosts();

        expect(response.posts).toEqual([]);
        expect(response.moreResultsAvailable).toBe(false);
    });

    
        it('should handle API errors', async () => {
            mockedAxios.get.mockRejectedValue(new Error('Network Error'));

            const client = new WebzApiClient();
    
            await expect(client.fetchPosts()).rejects.toThrow('Failed to fetch posts from Webz.io');
        });
    });