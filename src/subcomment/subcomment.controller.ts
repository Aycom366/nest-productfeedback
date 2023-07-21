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

@Controller('subcomment')
export class SubcommentController {
  constructor(private readonly subcommentService: SubcommentService) {}

  @Post()
  createComment(@Body() body: CreateSubcommentDto, @Req() request) {
    return this.subcommentService.createSubcomment(body, request.user.id);
  }

  @Patch(':subCommentId')
  updateComment(
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
  deleteComment(
    @Req() request,
    @Param('subCommentId', ParseIntPipe) subCommentId: number,
  ) {
    return this.subcommentService.deleteSubcomment(
      request.user.id,
      subCommentId,
    );
  }
}
