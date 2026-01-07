import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import * as sharp from 'sharp';

export interface UploadedFile {
  filename: string;
  url: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class UploadsService {
  private readonly uploadsDir: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadsDir = join(process.cwd(), 'uploads');
    this.baseUrl = this.configService.get<string>('API_BASE_URL') || 'http://localhost:3000';
  }

  /**
   * Process and optimize an uploaded image
   */
  async processImage(
    file: Express.Multer.File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {}
  ): Promise<UploadedFile> {
    const { maxWidth = 1200, maxHeight = 1200, quality = 80 } = options;

    const inputPath = file.path;
    const outputFilename = `optimized-${file.filename.replace(/\.\w+$/, '.webp')}`;
    const outputPath = join(this.uploadsDir, outputFilename);

    try {
      await sharp(inputPath)
        .resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality })
        .toFile(outputPath);

      // Remove original file
      if (existsSync(inputPath)) {
        unlinkSync(inputPath);
      }

      const stats = await sharp(outputPath).metadata();

      return {
        filename: outputFilename,
        url: `${this.baseUrl}/uploads/${outputFilename}`,
        size: stats.size || 0,
        mimetype: 'image/webp',
      };
    } catch (error) {
      // Clean up on error
      if (existsSync(inputPath)) {
        unlinkSync(inputPath);
      }
      if (existsSync(outputPath)) {
        unlinkSync(outputPath);
      }
      throw new BadRequestException('Failed to process image');
    }
  }

  /**
   * Process a profile picture with specific dimensions
   */
  async processProfilePicture(file: Express.Multer.File): Promise<UploadedFile> {
    return this.processImage(file, {
      maxWidth: 500,
      maxHeight: 500,
      quality: 85,
    });
  }

  /**
   * Process an event cover image
   */
  async processEventImage(file: Express.Multer.File): Promise<UploadedFile> {
    return this.processImage(file, {
      maxWidth: 1600,
      maxHeight: 900,
      quality: 80,
    });
  }

  /**
   * Delete an uploaded file
   */
  deleteFile(filename: string): boolean {
    const filePath = join(this.uploadsDir, filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      return true;
    }
    return false;
  }

  /**
   * Get the full URL for an upload
   */
  getFileUrl(filename: string): string {
    return `${this.baseUrl}/uploads/${filename}`;
  }
}
