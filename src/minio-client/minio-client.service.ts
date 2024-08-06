
import { Injectable, Logger, HttpException, HttpStatus, Body, Inject } from '@nestjs/common';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import { CreateMinioClientDto, CreateMinioCSVDto } from './dto/create-minio-client.dto';
import { UpdateMinioClientDto } from './dto/update-minio-client.dto';
import { ConfigService } from '@nestjs/config';
let Minio = require('minio')
const converter = require('json-2-csv');
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
const AWS = require('aws-sdk');
const {Buffer} = require('buffer');
const fs = require("fs");
const path = require("path");


@Injectable()
export class MinioClientService {

  accessKey = this.configService.get('MINIO_ACCESS_KEY');
  secretKey = this.configService.get('MINIO_SECRET_KEY');
  endPoint = this.configService.get('MINIO_ENDPOINT');
  port = this.configService.get('MINIO_PORT');
  url = this.configService.get('MINIO_URL');

  minioClient: any = new Minio.Client({
    url: this.url,
    accessKey: this.accessKey,
    secretKey: this.secretKey,
    endPoint: this.endPoint,
    port: +this.port,
    useSSL: false,
  });

  constructor(
    private readonly configService: ConfigService,
  ) {
    console.log('accessKey', this.accessKey);
  }

  // constructor( @Inject(MinioService) private readonly minioClient: MinioService,
  // ) {}

  // constructor(@InjectMinioClient() private readonly minioClient: MinioClient
  //   ) { this.logger = new Logger('MinioService')}

  private readonly logger: Logger;
  private readonly bucketName = process.env.MINIO_BUCKET_NAME;


  public get client() {
    return this.minioClient;
  }

  async makeBucket(bucket_name: string) {
    if(!await this.minioClient.bucketExists(bucket_name)) {
      await this.minioClient.makeBucket(bucket_name, '');
    }
    return await this.client.listBuckets();
  }

  // async uploadImage( @Body() createMinioClientDto: CreateMinioClientDto)
  // {
  //   console.log('file', createMinioClientDto);

  //   let {
  //     base64,
  //     image_name,
  //     path
  //   } = createMinioClientDto;

  //   let bucket_name = this.bucketName;

  //   if(!await this.minioClient.bucketExists(bucket_name)) {
  //     await this.minioClient.makeBucket(bucket_name, '');
  //   }
    
  //   const bucketName: string = bucket_name;
  //   const timestamp = Date.now().toString();
  //   console.log('timestamp', timestamp);

  //   // We need to append the extension at the end otherwise Minio will save it as a generic file
  //   const fileName = `${path}/${image_name.replace(' ','_')}_${timestamp}.png`;
  //   const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""),'base64');

  //   const minio_res = await this.client.putObject(
  //     bucketName,
  //     fileName,
  //     buffer,
  //     // metaData,
  //     function (err, res) {
  //       if (err) {
  //         throw new HttpException(
  //           'Error uploading file',
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }
  //     },
  //   );

  //   return {
  //     url: `${process.env.MINIO_URL}/${bucket_name}/${fileName}`,
  //   };
  // }

  async uploadCSV( @Body() createMinioCSVDto: CreateMinioCSVDto)
  {
    console.log('file', createMinioCSVDto);

    let {
      data,
      name,
      path
    } = createMinioCSVDto;

    if(!await this.minioClient.bucketExists(this.bucketName)) {
      await this.minioClient.makeBucket(this.bucketName, '');
    }
    
    const bucketName: string = this.bucketName;
    const timestamp = Date.now().toString();
    console.log('timestamp', timestamp);

    // We need to append the extension at the end otherwise Minio will save it as a generic file
    const fileName = `${path}/${name.replace(' ','_')}_${timestamp}.csv`;
    const csv = await converter.json2csvAsync(data);
    const buffer = csv

    // return buffer;
    // const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""),'base64');

    const minio_res = await this.client.putObject(
      bucketName,
      fileName,
      buffer,
      // 'application/csv',
      // metaData,
      function (err, res) {
        if (err) {
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );

    return {
      url: `${process.env.MINIO_URL}/${bucketName}/${fileName}`,
    };
  }

  async upload( @Body() createMinioClientDto: CreateMinioClientDto)
  {
    console.log('file', createMinioClientDto);

    let {
      base64,
      image_name,
      bucket_name
    } = createMinioClientDto;

    if(!await this.minioClient.bucketExists(bucket_name)) {
      await this.minioClient.makeBucket(bucket_name, '');
    }
    
    const bucketName: string = bucket_name;
    const timestamp = Date.now().toString();
    console.log('timestamp', timestamp);

    // We need to append the extension at the end otherwise Minio will save it as a generic file
    const fileName = `${image_name.replace(' ','_')}_${timestamp}.png`;
    const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""),'base64');

    const minio_res = await this.client.putObject(
      bucketName,
      fileName,
      buffer,
      // metaData,
      function (err, res) {
        if (err) {
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );

    return {
      url: `${process.env.MINIO_URL}/${bucket_name}/${fileName}`,
    };
  }

  async findOne(image: string, bucketName: string = this.bucketName,) {

    const getMinio = await this.minioClient.getObject(bucketName, image);

    console.log('getMinio', getMinio);

    return getMinio;

    const minio_res = await this.client.getObject(bucketName, image, function(err, dataStream) {
      if (err) {
        return console.log(err)
      }

    })

    return minio_res;
  }

  async deleteBucket(bucketName: string) {
    await this.client.removeBucket(bucketName);

    return {
      status: 'success',
      data: await this.client.listBuckets()
    }
  }

  async deleteObject(objetName: string, bucketName: string = this.bucketName) {
    this.client.removeObject(bucketName, objetName);

    return {
      status: 'success'
    }
  }
  

  // public async upload(
  //   file: BufferedFile,
  //   bucketName: string = this.bucketName,
  // ) {
  //   if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
  //     throw new HttpException(
  //       'File type not supported',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const timestamp = Date.now().toString();
  //   const hashedFileName = crypto
  //     .createHash('md5')
  //     .update(timestamp)
  //     .digest('hex');
  //   const extension = file.originalname.substring(
  //     file.originalname.lastIndexOf('.'),
  //     file.originalname.length,
  //   );
  //   const metaData = {
  //     'Content-Type': file.mimetype,
  //   };

  //   // We need to append the extension at the end otherwise Minio will save it as a generic file
  //   const fileName = hashedFileName + extension;

  //   this.client.putObject(
  //     bucketName,
  //     fileName,
  //     file.buffer,
  //     metaData,
  //     function (err, res) {
  //       if (err) {
  //         throw new HttpException(
  //           'Error uploading file',
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }
  //     },
  //   );

  //   return {
  //     url: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`,
  //   };
  // }

}
