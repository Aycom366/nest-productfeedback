import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { SubcommentService } from './subcomment.service';
import {
  CreateSubcommentDto,
  UpdateSubcommentDto,
} from 'src/dto/subcomment.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

const subCommentResponse = {
  commentId: 9,
  message: 'This is a subcomment from another user',
  id: 3,
  owner: {
    avatarUrl: null,
    name: 'johndoe',
    id: 3,
  },
};

@ApiBearerAuth('Bearer')
@ApiTags('Subcomment')
@Controller('subcomment')
export class SubcommentController {
  constructor(private readonly subcommentService: SubcommentService) {}

  @Post()
  @ApiNotFoundResponse({
    schema: {
      example: {
        message: 'Comment not found',
        statusCode: 404,
      },
    },
  })
  @ApiCreatedResponse({
    schema: {
      example: subCommentResponse,
    },
  })
  createSubcomment(@Body() body: CreateSubcommentDto, @Req() request) {
    return this.subcommentService.createSubcomment(body, request.user.id);
  }

  @Patch(':subCommentId')
  @ApiNotFoundResponse({
    schema: {
      example: {
        message: 'Not Found',
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
  @ApiCreatedResponse({
    schema: {
      example: subCommentResponse,
    },
  })
  updateSubComment(
    @Body() body: UpdateSubcommentDto,
    @Req() request,
    @Param('subCommentId', ParseIntPipe) subCommentId: number,
  ) {
    return this.subcommentService.updateSubcomment(
      body,
      subCommentId,
      request.user.id,
    );
  }

  @HttpCode(204)
  @Delete(':subCommentId')
  deleteSubComment(
    @Req() request,
    @Param('subCommentId', ParseIntPipe) subCommentId: number,
  ) {
    return this.subcommentService.deleteSubcomment(
      request.user.id,
      subCommentId,
    );
  }
}
