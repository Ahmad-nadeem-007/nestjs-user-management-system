import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Res,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileService } from './file.service';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Files')
@Controller('files')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class FileController {
  constructor(private readonly fileService: FileService) { }
  @Public()
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.create(file);
  }


  @Public()

  @Get('image/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: 'uploads' });
  }




  @Public()

  @Delete('image')
  async deleteImage(
    @Query('filename') filename: string) {
    // await this.uploadService.deleteFile(filename);
    await this.fileService.deleteFile(filename);
    return { message: 'File deleted successfully' };
  }
}
