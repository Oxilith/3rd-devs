import type {DataProcessor} from './interfaces.ts';

export class StreamProcessor implements DataProcessor<ReadableStream, string[]> {
    static async readStreamToArray(stream: ReadableStream): Promise<string[]> {
        const reader = stream.getReader();
        const decoder = new TextDecoder('utf-8');
        let chunks: string = '';
        let done = false;

        while (!done) {
            const {value, done: streamDone} = await reader.read();
            if (value) {
                chunks += decoder.decode(value, {stream: !streamDone});
            }
            done = streamDone;
        }

        return chunks.split('\n').filter(line => line.trim() !== '');
    }

    static async readStreamToJson<T>(stream: ReadableStream): Promise<T> {
        const reader = stream.getReader();
        const decoder = new TextDecoder('utf-8');
        let chunks: string = '';
        let done = false;

        while (!done) {
            const {value, done: streamDone} = await reader.read();
            if (value) {
                chunks += decoder.decode(value, {stream: !streamDone});
            }
            done = streamDone;
        }

        return JSON.parse(chunks) as T;
    }

    async process(stream: ReadableStream): Promise<string[]> {
        return StreamProcessor.readStreamToArray(stream);
    }
}
