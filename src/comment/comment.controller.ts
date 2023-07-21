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
import { CreateCommentDto, UpdateCommentDto } from 'src/dto/comment.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

const commentResponse = {
  feedbackId: 8,
  message: 'This is my third comment and lemme try subcommeting',
  id: 9,
  owner: {
    avatarUrl: null,
    name: 'john doe',
    id: 3,
  },
};

@ApiBearerAuth('Bearer')
@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiCreatedResponse({
    schema: {
      example: commentResponse,
    },
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        message: 'Feedback not found',
        statusCode: 404,
      },
    },
  })
  createComment(@Body() body: CreateCommentDto, @Req() request) {
    return this.commentService.createComment(body, request.user.id);
  }

  @Get(':feedbackId')
  @ApiOkResponse({
    schema: {
      example: [
        {
          ...commentResponse,
          SubComment: [],
        },
      ],
    },
  })
  getComments(@Param('feedbackId', ParseIntPipe) feedbackId: number) {
    return this.commentService.getComments(feedbackId);
  }

  @Patch(':commentId')
  @ApiNotFoundResponse({
    description: "If Comment Id doesn't exist in the database",
    schema: {
      example: {
        message: 'Comment not found',
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
  @ApiOkResponse({ schema: { example: commentResponse } })
  updateComment(
    @Body() body: UpdateCommentDto,
    @Req() request,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentService.updateComment(body, commentId, request.user.id);
  }

  @HttpCode(204)
  @Delete(':commentId')
  deleteComment(
    @Req() request,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentService.deleteComment(request.user.id, commentId);
  }
}
