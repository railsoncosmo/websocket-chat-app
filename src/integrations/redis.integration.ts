import { createClient, type RedisClientType } from 'redis';

export class RedisIntegration {
    static client: RedisClientType;

    constructor() {
        if (!process.env.REDIS_URL) {
            throw new Error('REDIS_URL não definida nas variáveis de ambiente');
        }

        RedisIntegration.client = createClient({
            url: process.env.REDIS_URL,
        });
        RedisIntegration.connect().then(() => {
            console.log('Redis Conectado com sucesso.');
        }).catch((err) => {
            console.error('Erro ao conectar ao Redis:', err);
            RedisIntegration.disconnect();
        });
    }

    static async connect() {
        await RedisIntegration.client.connect();
    }

    static async disconnect() {
        RedisIntegration.client.destroy();
    }

    static async set(key: string, value: string, ttl?: number) {
        if (ttl) {
            return await RedisIntegration.client.set(key, JSON.stringify(value), { EX: ttl });
        } 
        return await RedisIntegration.client.set(key, JSON.stringify(value));
    }

    static async get(key: string) {
        return JSON.parse(await RedisIntegration.client.get(key) || 'null');
    }

    static async delete(key: string) {
        await RedisIntegration.client.del(key);
    }
}