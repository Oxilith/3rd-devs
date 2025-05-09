import {ApiService} from './apiService.ts';
import {StreamProcessor} from './streamProcessor.ts';
import type {TaskResponse, VerificationRequestBody} from './interfaces.ts';
import {config} from './config.ts';


export class TaskManager {
    private streamProcessor: StreamProcessor;

    constructor(private apiService: ApiService) {
        this.streamProcessor = new StreamProcessor();
    }

    async executeTask(
        taskId: string,
        inputEndpoint: string,
        verifyEndpoint = config.endpoints.prework.verify
    ): Promise<any> {
        const inputStream = await this.apiService.fetchEndpoint(inputEndpoint);
        const parsedAnswer = await this.streamProcessor.process(inputStream);

        const verificationBody: VerificationRequestBody = {
            task: taskId,
            apikey: this.apiService['apiKey'],
            answer: parsedAnswer,
        };

        return await this.apiService.postData(
            verifyEndpoint,
            verificationBody
        );
    }

    async processTask<T, R>(
        taskId: string,
        inputEndpoint: string,
        verifyEndpoint: string,
        processor: (data: any) => Promise<T[]>,
    ): Promise<TaskResponse<R>> {
        try {
            const inputStream = await this.apiService.fetchEndpoint(inputEndpoint);
            const processedData = await processor(inputStream);

            const verificationBody: VerificationRequestBody = {
                task: taskId,
                apikey: this.apiService['apiKey'],
                answer: processedData,
            };

            const response = await this.apiService.postData<VerificationRequestBody, R>(
                verifyEndpoint,
                verificationBody
            );

            return {
                status: 'ok',
                data: response
            };
        } catch (error) {
            return {
                status: 'error',
                message: error instanceof Error ? error.message : String(error)
            };
        }
    }
}
