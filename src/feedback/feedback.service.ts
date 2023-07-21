import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FeedBackCategory, RoadMap } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface FeedBackParams {
  title: string;
  category: FeedBackCategory;
  detail: string;
}

interface FeedBackQueryParams {
  category: FeedBackCategory;
}

export const userToReturn = {
  avatarUrl: true,
  name: true,
  id: true,
};

export const feedBackReturnValue = {
  category: true,
  detail: true,
  title: true,
  id: true,
  roadMap: true,
  user: {
    select: userToReturn,
  },
  upvotes: true,
};

@Injectable()
export class FeedbackService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRoadMap() {
    const feedbacks = await this.getFeedbacks();
    const roadMapValues = Object.keys(RoadMap);
    const transformedData = roadMapValues.map((roadMap) => {
      const data = feedbacks.filter((obj) => obj.roadMap === roadMap);
      const count = data.length;

      return {
        count,
        roadMap,
        data,
      };
    });

    return transformedData;
  }

  async handleUpVote({ feedBackId }: { feedBackId: number }, userId: number) {
    const feedback = await this.prismaService.feedback.findUnique({
      where: {
        id: feedBackId,
        upvotes: {
          has: userId,
        },
      },
      select: { upvotes: true },
    });
    let newFeedback;
    if (!feedback) {
      newFeedback = await this.prismaService.feedback.update({
        where: {
          id: feedBackId,
        },
        data: {
          upvotes: { push: userId },
        },
      });
    } else {
      const updatedUpvotes = feedback.upvotes.filter((id) => id !== userId);
      newFeedback = await this.prismaService.feedback.update({
        where: { id: feedBackId },
        data: {
          upvotes: {
            set: updatedUpvotes,
          },
        },
      });
    }
    return newFeedback;
  }

  async createFeedback(body: FeedBackParams, id: number) {
    const feedback = await this.prismaService.feedback.create({
      data: { ...body, userId: id },
      select: {
        ...feedBackReturnValue,
        Comment: {
          select: { _count: true },
        },
      },
    });

    return feedback;
  }

  async getFeedback(id: number) {
    const populatedFeedback = await this.prismaService.feedback.findUnique({
      where: { id },
      select: {
        category: true,
        detail: true,
        id: true,
        user: {
          select: userToReturn,
        },
        title: true,
        Comment: {
          select: {
            feedbackId: true,
            id: true,
            message: true,
            owner: {
              select: userToReturn,
            },
            SubComment: {
              select: {
                commentId: true,
                id: true,
                message: true,
                owner: {
                  select: userToReturn,
                },
              },
            },
          },
        },

        upvotes: true,
      },
    });
    if (!populatedFeedback) throw new NotFoundException('Feedback not found');

    return populatedFeedback;
  }

  async getFeedbacks(filter?: FeedBackQueryParams) {
    const populatedFeedback = await this.prismaService.feedback.findMany({
      where: filter,
      select: {
        ...feedBackReturnValue,
        upvotes: true,
        _count: {
          select: {
            Comment: true,
          },
        },
      },
    });
    return populatedFeedback;
  }

  async updateFeedBack(
    body: Partial<FeedBackParams>,
    id: number,
    currentLoginUserId: number,
  ) {
    const feedback = await this.prismaService.feedback.findUnique({
      where: { id },
    });
    if (!feedback) throw new NotFoundException('Feedback not found');

    if (feedback.userId !== currentLoginUserId) throw new ForbiddenException();

    return await this.prismaService.feedback.update({
      where: { id },
      data: body,
      select: {
        ...feedBackReturnValue,
        Comment: {
          select: { _count: true },
        },
      },
    });
  }

  async deleteFeedback(id: number, currentLoginUserId: number) {
    const feedback = await this.prismaService.feedback.findUnique({
      where: { id },
    });
    if (!feedback) throw new NotFoundException('Feedback not found');

    if (feedback.userId !== currentLoginUserId) throw new ForbiddenException();

    await this.prismaService.feedback.delete({ where: { id } });
    return;
  }
}
