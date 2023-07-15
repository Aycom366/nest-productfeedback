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

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('/create')
  async createFeedback(@Body() body: CreateFeedbackDto, @Req() request) {
    return this.feedbackService.createFeedback(body, request.user.id);
  }

  @Get('/roadmap')
  async getRoadMap() {
    return this.feedbackService.getRoadMap();
  }
  @Patch('/upvote')
  async upVote(@Body() body: UpvoteDto, @Req() request) {
    return this.feedbackService.handleUpVote(body, request.user.id);
  }

  @Get(':id')
  async getFeedBack(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.getFeedback(id);
  }

  @Get('')
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
