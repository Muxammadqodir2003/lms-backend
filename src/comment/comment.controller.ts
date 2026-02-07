import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CommentDto } from './dto/commentDto';
import { User } from 'src/common/decorators/user.decorator';
import { Throttle } from '@nestjs/throttler';
import { RATE_LIMIT } from 'src/constants';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Throttle({
    default: { limit: RATE_LIMIT.COMMENT.limit, ttl: RATE_LIMIT.COMMENT.ttl },
  })
  @HttpCode(201)
  @Auth('STUDENT')
  @Post(':slug')
  async createComment(
    @Body() data: CommentDto,
    @User('id') id: string,
    @Param('slug') slug: string,
  ) {
    return await this.commentService.createComment(data, id, slug);
  }

  @HttpCode(200)
  @Auth('STUDENT')
  @Get('get-all/:slug')
  async getCommentsByCourseId(@Param('slug') slug: string) {
    return await this.commentService.getCommentsByCourseId(slug);
  }

  @HttpCode(200)
  @Auth('STUDENT')
  @Get(':slug')
  async getCommentOne(@Param('slug') slug: string, @User('id') userId: string) {
    return await this.commentService.getCommentOne(userId, slug);
  }
}
