import { FeedBackCategory, RoadMap } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(FeedBackCategory)
  category: FeedBackCategory;

  @IsString()
  @IsNotEmpty()
  detail: string;
}

export class UpdateFeedbackDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsEnum(FeedBackCategory)
  category: FeedBackCategory;

  @IsOptional()
  @IsEnum(RoadMap)
  roadMap: RoadMap;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  detail: string;
}

export class UpvoteDto {
  @IsNumber()
  @IsPositive()
  feedBackId: number;
}
