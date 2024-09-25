import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async create(createOrderDto: CreateOrderDto, userId: number) {
    const { books } = createOrderDto;
    const titles = await this.prisma.book.findMany({
      where: {
        name: {
          in: books,
        },
      },
    });

    const foundTitles = new Set(titles.map((book) => book.name));
    const missingTitles = books.filter((name) => !foundTitles.has(name));

    if (missingTitles.length > 0) {
      throw new NotFoundException(
        `Books with names ${missingTitles.join(', ')} not found`,
      );
    }

    const totalPrice = titles.reduce((sum, book) => sum + book.price, 0);

    const result = await this.prisma.order.create({
      data: { ...createOrderDto, price: totalPrice, userId },
    });
    return result;
  }

  async findAll(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
    });
    if (!orders) {
      throw new HttpException(
        'Order with such id doesnt exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return orders;
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new HttpException(
        'Order with such id doesnt exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new HttpException(
        'Order with such id doesnt exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { books } = updateOrderDto;
    const titles = await this.prisma.book.findMany({
      where: {
        name: {
          in: books,
        },
      },
    });

    const foundTitles = new Set(titles.map((book) => book.name));
    const missingTitles = books.filter((name) => !foundTitles.has(name));

    if (missingTitles.length > 0) {
      throw new NotFoundException(
        `Books with names ${missingTitles.join(', ')} not found`,
      );
    }

    const totalPrice = titles.reduce((sum, book) => sum + book.price, 0);

    const result = await this.prisma.order.update({
      where: { id },
      data: { ...updateOrderDto, price: totalPrice },
    });
    return result;
  }

  async remove(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new HttpException(
        'Order with such id doesnt exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this.prisma.order.delete({
      where: { id },
    });
    return result;
  }
}
