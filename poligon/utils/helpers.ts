export async function executeWithErrorHandling<T>(
    delegate: () => Promise<T>
): Promise<T | undefined> {
    try {
        return await delegate();
    } catch (error) {
        if (error instanceof Error) {
            console.error('An error occurred:', error.message);
            if (error.stack) {
                console.debug('Stack trace:', error.stack);
            }
        } else {
            console.error('An unknown error occurred:', error);
        }
        return undefined;
    }
}

export function getEnvVar(name: string, required = true): string | undefined {
    const value = process.env[name];
    if (required && !value) {
        throw new Error(`Required environment variable ${name} is not set`);
    }
    return value;
}

export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000
): Promise<T> {
    let retries = 0;
    let lastError: Error | unknown;

    while (retries < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            retries++;
            if (retries >= maxRetries) break;

            const delayMs = initialDelay * Math.pow(2, retries - 1);
            console.warn(`Retry ${retries}/${maxRetries} after ${delayMs}ms`);
            await delay(delayMs);
        }
    }

    throw lastError;
}
