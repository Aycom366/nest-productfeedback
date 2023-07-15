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
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from 'src/dto/comment.dts';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  createComment(@Body() body: CreateCommentDto, @Req() request) {
    return this.commentService.createComment(body, request.user.id);
  }

  @Get(':feedbackId')
  getComments(@Param('feedbackId', ParseIntPipe) feedbackId: number) {
    return this.commentService.getComments(feedbackId);
  }

  @Patch(':commentId')
  updateComment(
    @Body() body: CreateCommentDto,
    @Req() request,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentService.updateComment(body, commentId, request.user.id);
  }

  @HttpCode(204)
  @Delete(':feedbackId/:commentId')
  deleteComment(
    @Req() request,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentService.deleteComment(request.user.id, commentId);
  }
}
