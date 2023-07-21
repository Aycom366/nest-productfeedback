import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { userToReturn } from 'src/feedback/feedback.service';
import { PrismaService } from 'src/prisma/prisma.service';

interface SubcommentParams {
  message: string;
  commentId: number;
}

const commentToReturn = {
  commentId: true,
  message: true,
  id: true,
  owner: {
    select: { ...userToReturn },
  },
};

@Injectable()
export class SubcommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSubcomment(body: SubcommentParams, userId: number) {
    const subComment = await this.prismaService.subComment.create({
      data: {
        message: body.message,
        commentId: body.commentId,
        ownerId: userId,
      },
      select: {
        commentId: true,
        message: true,
        id: true,
        owner: {
          select: { ...userToReturn },
        },
      },
    });
    return subComment;
  }

  async updateSubcomment(
    body: Partial<SubcommentParams>,
    commentId: number,
    userId: number,
  ) {
    const subComment = await this.prismaService.subComment.findUnique({
      where: { id: commentId },
    });
    if (!subComment) throw new NotFoundException();

    if (subComment.ownerId !== userId) throw new ForbiddenException();

    return this.prismaService.subComment.update({
      where: { id: commentId },
      data: body,
      select: {
        ...commentToReturn,
      },
    });
  }

  async deleteSubcomment(userId: number, commentId: number) {
    const subComment = await this.prismaService.subComment.findUnique({
      where: { id: commentId },
    });
    if (!subComment) throw new NotFoundException();

    if (subComment.ownerId !== userId) throw new ForbiddenException();

    await this.prismaService.subComment.delete({ where: { id: commentId } });

    return;
  }
}
