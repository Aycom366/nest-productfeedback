import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: FeedBackCategory,
    default: FeedBackCategory.UI,
  })
  @IsEnum(FeedBackCategory)
  category: FeedBackCategory;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  detail: string;
}

export class UpdateFeedbackDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(FeedBackCategory)
  category: FeedBackCategory;

  @ApiProperty({
    enum: RoadMap,
    enumName: 'Gender',
    default: RoadMap.InProgress,
  })
  @IsOptional()
  @IsEnum(RoadMap)
  roadMap: RoadMap;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  detail: string;
}

export class UpvoteDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  feedBackId: number;
}
