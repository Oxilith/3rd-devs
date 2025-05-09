export interface VerificationRequestBody {
    task: string;
    apikey: string | undefined;
    answer: any[];
}

export interface TaskResponse<T> {
    status: 'ok' | 'error';
    data?: T;
    message?: string;
}

export interface DataProcessor<T, R> {
    process(data: T): Promise<R>;
}
