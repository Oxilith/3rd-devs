type RequestOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
};

export class ApiService {
    private defaultHeaders: Record<string, string>;

    constructor(private apiKey: string | undefined) {
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    async fetchEndpoint(endpoint: string, options: RequestOptions = {}): Promise<ReadableStream> {
        const response = await this.sendRequest(endpoint, options);
        return response.body!;
    }

    async fetchJson<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const response = await this.sendRequest(endpoint, options);
        return response.json();
    }

    async postData<T, R>(endpoint: string, body: T, customHeaders?: Record<string, string>): Promise<R> {
        const response = await this.sendRequest(endpoint, {
            method: 'POST',
            headers: {...this.defaultHeaders, ...customHeaders},
            body: JSON.stringify(body),
        });
        return response.json();
    }

    private async sendRequest(endpoint: string, options: RequestOptions = {}): Promise<Response> {
        const response = await fetch(endpoint, {
            method: options.method || 'GET',
            headers: options.headers || this.defaultHeaders,
            body: options.body,
        });

        if (!response.ok) {
            throw new Error(`API error [${response.status}]: ${await response.text()}`);
        }

        return response;
    }
}
