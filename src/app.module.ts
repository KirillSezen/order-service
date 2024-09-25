import { Module } from '@nestjs/common';
import { OrdersModule } from './order/orders.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [OrdersModule, PrismaModule],
})
export class AppModule {}
