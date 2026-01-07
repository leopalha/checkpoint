import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterOrganizerDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Password (min 8 characters)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({ description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Company name', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;
}

export class LoginOrganizerDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class UpdateOrganizerDto {
  @ApiProperty({ description: 'Full name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Company name', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({ description: 'New password (min 8 characters)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string;
}

export interface OrganizerResponseDto {
  id: string;
  email: string;
  name: string;
  companyName: string | null;
  createdAt: string;
}

export interface AuthResponseDto {
  accessToken: string;
  organizer: OrganizerResponseDto;
}
