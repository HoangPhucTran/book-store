import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: [process.env.NATS_URL || 'nats://localhost:4222'],
                }
            }
        ])
    ],
    exports: [ClientsModule,],
})

export class NatsClientModule {}
