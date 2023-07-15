import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { userToReturn } from 'src/feedback/feedback.service';
import { PrismaService } from 'src/prisma/prisma.service';

interface CommentParams {
  message: string;
  feedBackId: number;
}

const commentToReturn = {
  feedbackId: true,
  message: true,
  id: true,
  owner: {
    select: { ...userToReturn },
  },
};

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment(body: CommentParams, userId: number) {
    const comment = await this.prismaService.comment.create({
      data: {
        message: body.message,
        feedbackId: body.feedBackId,
        ownerId: userId,
      },
      select: {
        feedbackId: true,
        message: true,
        id: true,
        owner: {
          select: { ...userToReturn },
        },
      },
    });
    return comment;
  }

  async getComments(feedbackId: number) {
    return this.prismaService.comment.findMany({
      where: {
        feedbackId,
      },
      select: {
        ...commentToReturn,
        SubComment: {
          select: {
            commentId: true,
            message: true,
            id: true,
            owner: {
              select: { ...userToReturn },
            },
          },
        },
      },
    });
  }

  async updateComment(
    body: Partial<CommentParams>,
    commentId: number,
    userId: number,
  ) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException();

    if (comment.ownerId !== userId) throw new ForbiddenException();

    return this.prismaService.comment.update({
      where: { id: commentId },
      data: body,
      select: {
        ...commentToReturn,
      },
    });
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException();

    if (comment.ownerId !== userId) throw new ForbiddenException();

    await this.prismaService.comment.delete({ where: { id: commentId } });

    return;
  }
}
