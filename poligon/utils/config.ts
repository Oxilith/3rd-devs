export const config = {
    endpoints: {
        base: 'https://poligon.aidevs.pl',
        prework: {
            verify: 'https://poligon.aidevs.pl/verify',
            input: 'https://poligon.aidevs.pl/dane.txt'
        },
    },

    tasks: {
        prework: {
            taskId: 'POLIGON'
        },
    },

    request: {
        timeoutMs: 10000,
        maxRetries: 3
    }
};
