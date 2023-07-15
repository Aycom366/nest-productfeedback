import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsPositive()
  feedBackId: number;
}

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  feedbackId: number;
}
