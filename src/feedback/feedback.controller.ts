import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  CreateFeedbackDto,
  UpdateFeedbackDto,
  UpvoteDto,
} from 'src/dto/feedback.dto';
import { FeedbackService } from './feedback.service';
import { FeedBackCategory } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

export const feedbackResponse = {
  category: 'UI',
  detail: 'You look takeaway',
  title: 'Another Banger',
  id: 10,
  roadMap: 'InProgress',
  user: {
    avatarUrl: null,
    name: 'Esther Bamigboye',
    id: 3,
  },
  upvotes: [],
  Comment: [],
} as const;

@ApiBearerAuth('Bearer')
@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('/create')
  @ApiOkResponse({
    schema: { example: feedbackResponse },
  })
  async createFeedback(@Body() body: CreateFeedbackDto, @Req() request) {
    return this.feedbackService.createFeedback(body, request.user.id);
  }

  @Get('/roadmap')
  @ApiOkResponse({
    schema: {
      example: [
        {
          count: 0,
          roadMap: 'Planned',
          data: [],
        },
        {
          count: 3,
          roadMap: 'InProgress',
          data: [
            {
              category: 'UI',
              detail: 'You look takeaway',
              title: 'Another Banger',
              id: 8,
              roadMap: 'InProgress',
              user: {
                avatarUrl: null,
                name: 'Ayomide Bamigboye',
                id: 2,
              },
              upvotes: [],
              _count: {
                Comment: 1,
              },
            },
            {
              category: 'UI',
              detail: 'You look takeaway',
              title: 'Another Banger',
              id: 9,
              roadMap: 'InProgress',
              user: {
                avatarUrl: null,
                name: 'Esther Bamigboye',
                id: 3,
              },
              upvotes: [],
              _count: {
                Comment: 0,
              },
            },
            {
              category: 'UI',
              detail: 'You look takeaway',
              title: 'Another Banger',
              id: 10,
              roadMap: 'InProgress',
              user: {
                avatarUrl: null,
                name: 'Esther Bamigboye',
                id: 3,
              },
              upvotes: [],
              _count: {
                Comment: 0,
              },
            },
          ],
        },
        {
          count: 0,
          roadMap: 'Live',
          data: [],
        },
      ],
    },
  })
  async getRoadMap() {
    return this.feedbackService.getRoadMap();
  }

  @Patch('/upvote')
  @ApiOkResponse({
    schema: {
      example: {
        id: 8,
        title: 'Another Banger',
        category: 'UI',
        detail: 'You look takeaway',
        userId: 2,
        upvotes: [3],
        roadMap: 'InProgress',
      },
    },
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        message: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async upVote(@Body() body: UpvoteDto, @Req() request) {
    return this.feedbackService.handleUpVote(body, request.user.id);
  }

  @Get(':id')
  @ApiOkResponse({
    schema: {
      example: {
        category: 'UI',
        detail: 'You look takeaway',
        id: 8,
        user: {
          avatarUrl: null,
          name: 'Ayomide Bamigboye',
          id: 2,
        },
        title: 'Another Banger',
        Comment: [
          {
            feedbackId: 8,
            id: 9,
            message: 'This is my third comment and lemme try subcommeting',
            owner: {
              avatarUrl: null,
              name: 'Esther Bamigboye',
              id: 3,
            },
            SubComment: [
              {
                commentId: 9,
                id: 3,
                message: 'This is a subcomment from another user',
                owner: {
                  avatarUrl: null,
                  name: 'Esther Bamigboye',
                  id: 3,
                },
              },
            ],
          },
        ],
        upvotes: [3],
      },
    },
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        message: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async getFeedBack(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.getFeedback(id);
  }

  @Get()
  @ApiOkResponse({ schema: { example: [feedbackResponse] } })
  @ApiQuery({ name: 'category', required: false })
  async getFeedbacks(
    @Query('category')
    category?: FeedBackCategory,
  ) {
    const filter = {
      ...(category && { category }),
    };
    return this.feedbackService.getFeedbacks(filter);
  }

  @Patch(':id')
  @ApiNotFoundResponse({
    schema: {
      example: {
        message: 'Feedback not Found',
        statusCode: 404,
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: {
        message: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  @ApiOkResponse({ schema: { example: feedbackResponse } })
  async updateFeedBack(
    @Body() body: UpdateFeedbackDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() request,
  ) {
    return this.feedbackService.updateFeedBack(body, id, request.user.id);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteFeedback(@Param('id', ParseIntPipe) id: number, @Req() request) {
    return this.feedbackService.deleteFeedback(id, request.user.id);
  }
}
