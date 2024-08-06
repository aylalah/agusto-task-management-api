import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, HttpException, HttpStatus, UseInterceptors, UploadedFile, Inject } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
import { MinioClientService } from './minio-client.service';
import { CreateMinioClientDto, CreateMinioCSVDto, MakeBucketDto} from './dto/create-minio-client.dto';
import { UpdateMinioClientDto } from './dto/update-minio-client.dto';
import { BufferedFile } from 'src/minio-client/file.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { MinioClientService } from 'src/minio-client/minio-client.service';
// import { InjectMinioClient, MinioClient } from '@svtslv/nestjs-minio';
// import { MinioService } from "nestjs-minio-module";

@ApiTags('Minio Service')
@Controller('minio-client')
export class MinioClientController {

  constructor(
    private readonly minioClientService: MinioClientService
  ) { }

  private readonly logger: Logger;
  private readonly bucketName = process.env.MINIO_BUCKET_NAME;

  @Post('makeBucket')
  @ApiBearerAuth()
  async makeBucket(@Body() makeBucketDto: MakeBucketDto,) {

    let {
      bucket
    } = makeBucketDto;

    console.log('bucket', bucket);

    const bucketRes = await this.minioClientService.makeBucket(bucket)

    console.log('bucketRes', bucketRes);

    return bucketRes;

  }

  @Post('upload')
  @ApiBearerAuth()
  async upload(
    // @Body() file: BufferedFile,
    @Body() createMinioClientDto: CreateMinioClientDto,
    bucketName: string = this.bucketName,
  ) {

    const file = createMinioClientDto.base64;
    console.log('file', createMinioClientDto);

    let {
      base64,
      image_name,
      bucket_name
    } = createMinioClientDto;
    
    const timestamp = Date.now().toString();
    console.log('timestamp', timestamp);

    const bucketRes = await this.minioClientService.upload(createMinioClientDto)

    console.log('bucketRes', bucketRes);

    return {
      image_url: bucketRes.url,
      message: 'Image upload successful',
    };

  }

  @Post('upload_csv')
  @ApiBearerAuth()
  async uploadCSV(
    // @Body() file: BufferedFile,
    @Body() createMinioCSVDto: CreateMinioCSVDto) {

    console.log('file', createMinioCSVDto);

    // let {
    //   base64,
    //   image_name,
    //   bucket_name
    // } = createMinioClientDto;
    
    const timestamp = Date.now().toString();
    console.log('timestamp', timestamp);

    const bucketRes = await this.minioClientService.uploadCSV(createMinioCSVDto)

    // return bucketRes;

    console.log('bucketRes', bucketRes);

    return {
      status: 'success',
      // image_url: bucketRes.url,
      csv_url: bucketRes.url,
      message: 'Image upload successful',
    };

  }

  @Get(':image')
  async findOne(@Param('image') image: string, bucketName: string = this.bucketName,) {

    const getMinio = await this.minioClientService.findOne(bucketName, image);

    console.log('getMinio', getMinio);

    return getMinio;

  }

  @Delete(':bucketName')
  async deleteBucket(@Param('bucketName') bucketName: string) {

    const bucketRes = await this.minioClientService.deleteBucket(bucketName)

    console.log('bucketRes', bucketRes);

    return bucketRes;
  }

}
