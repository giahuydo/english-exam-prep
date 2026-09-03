import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExamFilesService } from './exam-files.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CurrentUser, AuthUser } from '../../auth/current-user.decorator';
import { UserRole } from '@app/shared';

interface MulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
}

@Controller('admin/exam-files')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ExamFilesController {
  constructor(private readonly svc: ExamFilesService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: MulterFile | undefined, @CurrentUser() user: AuthUser) {
    if (!file) throw new BadRequestException('file required');
    return this.svc.upload(file, user.id);
  }
}
