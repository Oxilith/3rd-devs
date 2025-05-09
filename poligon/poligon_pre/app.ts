import * as dotenv from 'dotenv';
import {executeWithErrorHandling} from '../utils/helpers.ts';
import {ApiService} from '../utils/apiService.ts';
import {TaskManager} from '../utils/taskManager.ts';
import {config} from '../utils/config.ts';

dotenv.config({path: '../../.env'});

(async () => {
    const apiKey = process.env.PERSONAL_API_KEY;
    const apiService = new ApiService(apiKey);
    const taskManager = new TaskManager(apiService);

    await executeWithErrorHandling(async () => {
        const result = await taskManager.executeTask('POLIGON', config.endpoints.prework.input);
        console.log(result);
    });
})();