import { ModuleRef } from '@nestjs/core';
import { I18nContext, translateOptions } from 'nestjs-i18n';
import path from 'path';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  lstatSync,
  copyFileSync,
  symlinkSync,
  readlinkSync,
  mkdir,
  rmdir,
} from 'fs';
import { BadRequestException } from '@nestjs/common';
import { isEmail, isNumberString } from 'class-validator';
import { Between, Like } from 'typeorm';
import { dateForSearch } from './time.utils';
import { createHash, randomBytes } from 'crypto';
import { hostname } from 'os';
import { User } from '../api/user';

export const randomDigits = (length = 5) => {
  return Math.random().toString().substr(2, length);
};

export const random = (length = 8) => {
  return randomBytes(Math.ceil(length)).toString('hex').substr(0, length)
};

export const environment = process.env.NODE_ENV;
export const isProduction = environment === 'production';
export const isTesting = environment === 'testing';
export const isLocal = environment === 'local';
var forge = require('node-forge');

/**
 * set up a handle for module ref
 * to be used to inject services without the contructor
 */
export let moduleRef: ModuleRef;
export const setModuleRef = (aModuleRef: ModuleRef) => {
  if (!moduleRef) {
    moduleRef = aModuleRef;
  }
};

export const outject = (service: any): any => {
  return moduleRef.get(service);
};

export const formatPhoneNumber = (value: string): string => {
  if(!value) {
    return value
  }
  return value.replace(/(^0)/, '234').replace(/(^\+)/, '');
};

export const unifyPhoneNumber = (value: string): string => {
  if (![11, 13, 14].includes(value?.length)) {
    throw new BadRequestException(
      `Invalid phone number. Phone number must start with +234, 234 or 0`,
    );
  }

  if (
    !value.startsWith('+234') &&
    !value.startsWith('234') &&
    !value.startsWith('0')
  ) {
    throw new BadRequestException(
      `Invalid phone number. Phone number must start with +234, 234 or 0`,
    );
  }

  return value.replace(/(^0)/, '234').replace(/(^\+)/, '');
};

export const isPhoneNumber = (value: string): boolean => {
  return (
    isNumberString(value) &&
    [11, 13, 14].includes(value?.length) &&
    (value.startsWith('+234') ||
      value.startsWith('234') ||
      value.startsWith('0'))
  );
};

export const isEmailAddress = (value: string): boolean => {
  return isEmail(value);
};

export function isNumeric(str: string) {
  return !isNullOrUndefined(str) && /^\d+$/.test(str);
}

export function isNullOrUndefined(value: any) {
  return value === undefined || value === null;
}

export function isUndefined(value: any) {
  return value === undefined;
}

export function isBlankString(value: any) {
  return value === '';
}

export function isFunction(value: any) {
  return typeof value === 'function';
}

export function isObject(x: any) {
  return x != null && typeof x === 'object';
}

export function isArray(x: any) {
  return x != null && typeof x === 'object' && Array.isArray(x);
}

export function toJSON(mayBeJSON: string, returnJSON = false) {
  try {
    const obj = JSON.parse(mayBeJSON);
    if (obj && typeof obj === 'object') {
      return returnJSON ? obj : true;
    }
  } catch (e) {}
  return false;
}

export function ucfirst(phrase: string) {
  var firstLetter = phrase.substr(0, 1);
  return firstLetter.toUpperCase() + phrase.substr(1);
}

export const titleCase = (phrase: string) => {
  
  if(!phrase) {
    return phrase
  }

  let upper = true;
  let newPhrase = '';
  for (let i = 0, l = phrase?.length; i < l; i++) {
    // Note that you can also check for all kinds of spaces  with
    // phrase[i].match(/\s/)
    if (phrase[i] == ' ') {
      upper = true;
      newPhrase += phrase[i];
      continue;
    }
    newPhrase += upper ? phrase[i].toUpperCase() : phrase[i].toLowerCase();
    upper = false;
  }
  return newPhrase;
};

export const prettify = (phrase: string) => {
  return phrase.replace(/_/g, ' ');
};

export type HttpResponse = [boolean, number, string, string, any];

export const trimString = (characters: string, replaceWith: string = '') => {
  return characters.replace(/^\//, replaceWith).replace(/\/$/, replaceWith);
};

export const __ = (key: string, options?: translateOptions) => {
  const i18n = outject(I18nContext) as I18nContext;
  return i18n.translate(key, options);
};

export function copy(src: string, dest: string) {
  if (!existsSync(dest)) mkdirSync(dest);

  readdirSync(src).forEach((dirent) => {
    const [srcPath, destPath] = [src, dest].map((dirPath) =>
      path.join(dirPath, dirent),
    );
    const stat = lstatSync(srcPath);

    switch (true) {
      case stat.isFile():
        copyFileSync(srcPath, destPath);
        break;
      case stat.isDirectory():
        copy(srcPath, destPath);
        break;
      case stat.isSymbolicLink():
        symlinkSync(readlinkSync(srcPath), destPath);
        break;
    }
  });
}

export const mkDir = (path: string, callback: (e: any) => void) => {
  mkdir(path, { recursive: false }, callback);
};

export const rmDir = (path: string, callback: (e: any) => void) => {
  rmdir(path, { recursive: false }, callback);
};

export const mask = (val: string, use = '*') => {
  if (!val) {
    return null;
  }
  return '*******';
};

export const makeFilter = (
  query: string,
  from: string,
  to: string,
  columns: string[],
) => {
  let dateRange = {};
  let filter = [];
  if (!!from && !!to) {
    dateRange = { created_at: Between(dateForSearch(from), dateForSearch(to)) };
  }
  try {
    const parsedQuery = JSON.parse(query);
    if (Array.isArray(parsedQuery)) {
      filter = [...filter, ...parsedQuery];
    } else {
      throw new Error("JSON parsed, but its not an array");
    }
  } catch (error) {
    filter = [
      ...filter,
      ...(!!query ? columns.map((column) => ({ [column]: Like(`%${query}%`), ...dateRange })) : [dateRange]),
    ];
  }

  return filter;
};

const maxLength = 32
const service = 'KBN' // 3 xters
const host = createHash('md5').update(hostname()).digest('hex').substr(0, 6) // 6 xters
const processId = ('' + process.pid).padStart(3, '0') // 3 xters
export const generateTransactionReference = () => {
  const time = new Date().getTime() // 13 xters
  const wildcard = randomBytes(256/8).toString('hex').substr(0, 7) // 7 xters
  return `${time}-${host}-${service}-${processId}-${wildcard}`.substr(0, maxLength).toUpperCase()
}

export const getTier = (user: User) => {
  // const tier0 = !!user.phone_otp_verified
  // const tier1 = tier0 && !!user.image
  // const tier2 = tier1 && !!user.bvn_otp_verified
  // const tier3 = tier2 && !!user.document_state

  // if(tier3) { return 3 }
  // if(tier2) { return 2 }
  // if(tier1) { return 1 }
  // if(tier0) { return 0 }

  return null
}

export const trimUser = (user: User) => {
  if(!user) {
    return user
  }
  return Object.keys(user).filter((k) =>  [
    'id',
    'customer_id',
    'gender',
    'date_of_birth',
    'document_state',
    'next_of_kin_title',
    'next_of_kin_name',
    'next_of_kin_relationship',
    'next_of_kin_state',
    'first_name',
    'last_name',
    'email',
    'email_valid',
    'phone_number',
    'bvn',
    'bvn_valid',
    'next_of_kin_phone',
    'device_type',
    'device_id',
    'suspended_at',
    'closed_at',
    'state_of_residence',
    'created_at',
    'state_of_residence',
    'home_address',
  ].includes(k)).reduce((prev, curr) => {
    return { ...prev, [curr]: user[curr]}
  }, {})
  
}

export const prettyTimeLeft = (ms: number) => {
  if(!ms || ms < 0 || ms <= (1000 * 60)) {
    return `a minute`
  }

  const s = Math.round(ms / 1000)
  const m = Math.round(s / 60)
  if(m <= 60) {
    return `${m} minute(s)`
  }

  const h = Math.round(m / 60)  
  if(h <= 24) {
    return `${m} hour(s)`
  }

  const d = Math.round(h / 24)
  return `${d} day(s)`
}

const toHex = function(str){

  var hex = '';
  for(var i=0;i<str.length;i++) {
      hex += ''+str.charCodeAt(i).toString(16);
  }
  return hex;

};

export const  authData = (options) => {
  const authString = "1Z"+options.card + 'Z' + options.pin + 'Z' + options.exp + 'Z' + options.cvv;
  //console.log("Auth-string: "+authString);
  const vv = toHex(authString);
  //var vv = SecureManager.toHex(options.authData);
  //console.log("vv: "+vv);
  const authDataBytes = forge.util.hexToBytes(vv);
  const clearSecureBytes = forge.util.createBuffer();

  const rsa = forge.pki.rsa;
  const modulos = new forge.jsbn.BigInteger(options.publicKeyModulus, 16);
  const exp = new forge.jsbn.BigInteger(options.publicKeyExponent, 16);
  const publicKey = rsa.setPublicKey(modulos, exp);

  const pexp = new forge.jsbn.BigInteger('4913cc0183c7a4a74b5405db55a15db8942f38c8cd7974b3644f6b625d22451e917345baa9750be9f8d10da47dbb45e602c86a6aa8bc1e7f7959561dbaaf35e78a8391009c8d86ee11da206f1ca190491bd765f04953765a2e55010d776044cb2716aee6b6f2f1dc38fce7ab0f4eafec8903a73555b4cf74de1a6bfc7f6a39a869838e3678dcbb96709068358621abf988e8049d5c07d128c5803e9502c05c3e38f94658480621a3e1c75fb4e39773e6eec50f5ef62958df864874ef0b00a0fb86f8382d1657381bc3c283567927f1f68d60205fd7ca1197265dd85c173badc1a15044f782602a9e14adc56728929c646c24fe8e10d26afc733158841d9ed4d1', 16);
  const privateKey = rsa.setPrivateKey(modulos, pexp);

  clearSecureBytes.putBytes(authDataBytes);
  const vvvv = clearSecureBytes.getBytes();

  // console.log("Clear secure: "+forge.util.bytesToHex(vvvv));

  const authBytes = publicKey.encrypt(vvvv);
  const auth = forge.util.encode64(authBytes);
  //console.log("Auth-hex: "+auth);

  //const dauth = privateKey.decrypt(auth, 'RSAES-PKCS1-V1_5');
  //console.log("dauth-hex: "+dauth);

  return auth;
}