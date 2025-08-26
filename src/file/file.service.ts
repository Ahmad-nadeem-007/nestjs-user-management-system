import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {

  constructor(
    private readonly configService: ConfigService,
  ) {
  }


  async create(file: Express.Multer.File) {
    const baseUrl = this.configService.get<string>('APP_URL');
    const imageUrl = `${baseUrl}/uploads/${file.filename}`;
    return {
      message: 'Image uploaded successfully',
      filePath: imageUrl,
    };
  }

  async deleteFile(filename: string) {
    try {
      // Use an absolute path that works consistently across different environments
      const uploadDir = path.join(process.cwd(), 'uploads');
      const filePath = path.join(uploadDir, filename);
      console.log("🚀 ~ UploadService ~ deleteFile ~ filePath:", filePath)

      // Ensure the file is within the uploads directory for security
      const resolvedFilePath = path.resolve(filePath);
      const resolvedUploadDir = path.resolve(uploadDir);

      if (!resolvedFilePath.startsWith(resolvedUploadDir)) {
        throw new Error('Invalid file path');
      }

      // Use async file system methods
      await fs.access(filePath);
      await fs.unlink(filePath);



      return { message: 'File deleted successfully' };
    } catch (error) {
      // Improved error handling
      if (error.code === 'ENOENT') {
        throw new NotFoundException('File not found');
      }
      // Log the error for debugging
      console.error('File deletion error:', error);
      throw new Error('Failed to delete file');
    }
  }
}

