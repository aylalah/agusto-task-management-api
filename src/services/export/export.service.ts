import { Injectable } from '@nestjs/common';
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    forwardRef,
    Inject,
    Query,
    Render
  } from '@nestjs/common';
import { IsNull, Like, Not } from 'typeorm';
import * as moment from "moment";
import { IoRedisService } from 'src/io-redis';
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
const AWS = require('aws-sdk');
const converter = require('json-2-csv');
const {Buffer} = require('buffer');
const fs = require("fs");

const path = require("path");
let now = moment().format();
let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

@Injectable()
export class ExportService {
    constructor(
        private readonly redis: IoRedisService,
    
      ) {}


      @Render('index.hbs')
      async puppeteer(metaData: {}) {
    
        const others = metaData['others'];
        const analysis = metaData['analysis'];
        const history = metaData['data'];
        const owner = metaData['owner'];
        console.log(analysis);
        const today2: any = moment().format("YYYY-MM-DD_HH:mm:ss");
    
        const templateHtml = fs.readFileSync(path.join(process.cwd(), `views/${owner}.html`), 'utf8');
        const template = handlebars.compile(templateHtml);
        const html = template({analysis: analysis, owner:owner, others: others, history: history});
        const fileName = others.reference+'.pdf';
        const csvfileName = others.reference+'.csv';
        const localLink = path.join(process.cwd(), `download/report/${fileName}`);
    
        //REMOTE CHROME CONVERTER
          const browser = await puppeteer.launch({
          executablePath: '/usr/bin/chromium-browser',
            args: [
              '--no-sandbox',
              '--disable-gpu',
              '--headless',
            ],
          });
    
        // LOCAL CHROME CONVERTER
        // const browser = await puppeteer.launch({
        //   headless: true,
        //   args: ['--use-gl=egl'],
        // });
    
        const page = await browser.newPage()
        await page.setContent(html, {
          waitUntil: 'domcontentloaded'
        })
        // create a pdf buffer
        const pdfBuffer = await page.pdf({
          fontFamily: 'sans-serif',
          fontWeight: 100,
          format: 'A3',
          width: '1410px',
          headerTemplate: "<p></p>",
          footerTemplate: "<p></p>",
          displayHeaderFooter: false,
          margin: {
            top: "10px",
            bottom: "30px"
          },
          printBackground: true,
          // path: pathLink
        })
    
        await browser.close();
        const upload = await this.uploadFileToAws({name: fileName, type: 'pdf', data:pdfBuffer});
    
        const csv = await converter.json2csvAsync(history);
        // write CSV to a file
        fs.writeFileSync(csvfileName, csv);
        const upload1 = await this.uploadFileToAws({name: csvfileName, type: 'csv', data:csv});
        console.log(upload1.fileUrl);
    
        return {status: 200, title: 'Report generated successfully', message: upload.message, data: fileName, link: upload.fileUrl, csvLink: upload1.fileUrl};
      }
    
      async uploadFileToAws(file){

        const s3 = new AWS.S3({
            // region: process.env.AWS_S3_REGION,
            accessKeyId: process.env.AWS_S3_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY
        });
    
        const fileName = file.name;
        const setPath = (filename) => `${process.env.FILE_PATH}/${filename}`;
        const awsLink = `${process.env.FILE_URL}/${process.env.FILE_PATH}/${fileName}`;
    
        // return setPath(fileName);
    
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `${setPath(fileName)}`,
            Body: file.data,
            ContentEncoding: 'base64',
            ContentType: `image/${file.type}`,
            // ACLs: 'public-read'
            };
    
            const res:any = await new Promise((resolve, reject) => {
              s3.upload(params, (err, data) => err == null ? resolve(data) : reject(err));
            });
    
          console.log(`File uploaded successfully. ${res.Location}`);
    
          if (res) {
            return {status: 200, message: 'File uploaded successfully', fileUrl: res.Location};
          } else {
            return {status: 404, message: 'File not uploaded', fileUrl: ''};
          }
          
      }
}
