import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateSubcommentDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsPositive()
  commentId: number;
}

export class UpdateSubcommentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  message: string;
}
