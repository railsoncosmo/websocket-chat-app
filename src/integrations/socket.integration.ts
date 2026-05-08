import { Server } from 'socket.io';

export class SocketIntegration {
    static socket: Server;

    constructor() {
        if (!process.env.SOCKET_HOST) {
            throw new Error('SOCKET_HOST não definida nas variáveis de ambiente');
        }

        SocketIntegration.socket = new Server(Number(process.env.SOCKET_HOST));
    }

    private static async connect() {
        SocketIntegration.socket.on('connection', (socket) => {
            socket.emit('Bem vindo!', { message: 'Bem vindo ao chat!' });
        });
    }

    static async emit(event: string, data: any) {
        await SocketIntegration.connect()
        SocketIntegration.socket.emit(event, data);
    }
}