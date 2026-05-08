import { Collection, MongoClient } from 'mongodb';

export class MongoDBIntegration {
    static client: MongoClient;

    constructor() {
        if (!process.env.MONGODB_URL) {
            throw new Error('MONGODB_URL não definida nas variáveis de ambiente');
        }

        MongoDBIntegration.client = new MongoClient(process.env.MONGODB_URL);
        MongoDBIntegration.connect().then(() => {
            console.log('MongoDB Conectado com sucesso.');
        }).catch((err) => {
            console.error('Erro ao conectar ao MongoDB:', err);
            MongoDBIntegration.disconnect();
        });
    }

    static async connect() {
        await MongoDBIntegration.client.connect();
    }

    static async disconnect() {
        await MongoDBIntegration.client.close();
    }

    static getCollection(name: string) {
        return MongoDBIntegration.client.db().collection(name);
    }

    static async insertOne(collection: string, document: any) {
        return await MongoDBIntegration.getCollection(collection).insertOne(document);
    }

    static async findOne(collection: string, query: any) {
        return await MongoDBIntegration.getCollection(collection).findOne(query);
    }

    static async find(collection: string, query: any) {
        return await MongoDBIntegration.getCollection(collection).find(query);
    }

    static async updateOne(collection: string, query: any, update: any) {
        return await MongoDBIntegration.getCollection(collection).updateOne(query, update);
    }

    static async delete(collection: string, query: any) {
        return await MongoDBIntegration.getCollection(collection).deleteOne(query);
    }
}