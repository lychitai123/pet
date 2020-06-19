import axios from 'axios'
import base64url from 'base64url'
import * as bs58 from 'bs58'
import * as moment from 'moment'
import utilCrypto from './crypto'
import mail from './mail'
import validate from './validate'
import sso from './sso'
import user from './user'
import * as permissions from './permissions'
import * as logger from './logger'
const _ = require('lodash')
const { PublicKey } = require('bitcore-lib-p256')
const jwkToPem = require('jwk-to-pem')

export { utilCrypto, sso, user, validate, permissions, mail, logger }

export const getEnv = () => process.env.NODE_ENV

export const min = (a, b) => {
  return a > b ? b : a
}
export const isSubArray = (sub, master) => {
  // console.log('isSubArr', sub, master)
  if (!Array.isArray(sub)) return false
  if (sub.length === 0) return true
  return sub.every(elem => master.indexOf(elem) > -1);
}
export const uncompressPubKey = (key: any) => {
  if (!key.compressed) {
    throw new Error('Public key is not compressed.')
  }
  const x = key.point.getX()
  const y = key.point.getY()
  const xbuf = x.toBuffer({ size: 32 })
  const ybuf = y.toBuffer({ size: 32 })
  return Buffer.concat([Buffer.from([0x04]), xbuf, ybuf])
}
export const getPemPubKey = (key: any) => {
  if (!key.compressed) {
    throw new Error('Public key is not compressed.')
  }
  const x = key.point.getX()
  const y = key.point.getY()
  const jwk = {
    kty: 'EC',
    crv: 'P-256',
    x: x.toBuffer({ size: 32 }).toString('base64'),
    y: y.toBuffer({ size: 32 }).toString('base64')
  }
  return jwkToPem(jwk)
}
export const getDidPublicKey = async (did: string) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: process.env.DID_SIDECHAIN_AUTH
  }
  const data = {
    jsonrpc: '2.0',
    method: 'resolvedid',
    params: {
      did,
      all: false
    }
  }
  try {
    const res = await axios.post(process.env.DID_SIDECHAIN_URL, data, {
      headers
    })
    if (res && res.data && res.data.result) {
      const base64 = _.get(res.data.result, 'transaction[0].operation.payload')
      const payload: any = base64url.decode(base64)
      const pubKeys = _.get(JSON.parse(payload), 'publicKey')
      const matched = pubKeys.find(el => el.id === '#primary')
      // compressed public key beginning with 02
      const publicKey = bs58.decode(matched.publicKeyBase58).toString('hex')
      const pemPubKey = getPemPubKey(PublicKey.fromString(publicKey))
      return {
        expirationDate: moment(payload.expires),
        publicKey: pemPubKey
      }
    }
  } catch (err) {
    logger.error(err)
  }
}
export const slug = (strSlug) => {
  if (strSlug == undefined || strSlug == '') {
    return '';
  }
  else {
    let slug = strSlug.toLowerCase();

    //Chuyển Ký Tự Có Dấu Thành Không Dấu
    slug = slug.replace(/á|à|ả|ã|ạ|ă|â|ắ|ằ|ẳ|ẵ|ặ|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/í|ỉ|ì|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ỏ|ò|õ|ọ|ơ|ô|ớ|ở|ờ|ỡ|ợ|ố|ổ|ồ|ỗ|ộ/gi, 'o');
    slug = slug.replace(/ú|ủ|ù|ũ|ụ|ư|ừ|ử|ừ|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỷ|ỳ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');

    //Xóa Ký Tự Đặc Biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\/|\?|\<|\>|\,|\.|\;|\"|\'|\[|\]|\{|\}|\:|\_|\\/gi, '');

    //Đổi Khoảng Trằng Thành Khoảng Trắng
    slug = slug.replace(/ /gi, '');

    //Phòng Trường Hợp Khách Hàng Nhập Nhiều Ký Tự Khoảng Trống
    slug = slug.replace(/\-{2,}/gi, '');

    //Xóa Các Ký Tự Gạch Ngang Ở Đầu Và Cuối
    slug = '@' + slug + '@'
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');

    return slug;
  }
}
export const slugVer2 = (strSlug) => {
  if (strSlug == undefined || strSlug == '') {
    return '';
  }
  else {
    let slug = strSlug.toLowerCase();

    //Chuyển Ký Tự Có Dấu Thành Không Dấu
    slug = slug.replace(/á|à|ả|ã|ạ|ă|â|ắ|ằ|ẳ|ẵ|ặ|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/í|ỉ|ì|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ỏ|ò|õ|ọ|ơ|ô|ớ|ở|ờ|ỡ|ợ|ố|ổ|ồ|ỗ|ộ/gi, 'o');
    slug = slug.replace(/ú|ủ|ù|ũ|ụ|ư|ừ|ử|ừ|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỷ|ỳ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');

    //Xóa Ký Tự Đặc Biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\/|\?|\<|\>|\,|\.|\;|\"|\'|\[|\]|\{|\}|\:|\_|\\/gi, '');

    //Đổi Khoảng Trằng Thành -
    slug = slug.replace(/ /gi, '-');

    //Phòng Trường Hợp Khách Hàng Nhập Nhiều Ký Tự Khoảng Trống
    slug = slug.replace(/\-{2,}/gi, '-');

    //Xóa Các Ký Tự Gạch Ngang Ở Đầu Và Cuối
    slug = '@' + slug + '@'
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');

    return slug;
  }
}
export const slugVer3 = (strSlug) => {
  if (strSlug == undefined || strSlug == '') {
    return '';
  }
  else {
    let slug = strSlug.toLowerCase();

    //Chuyển Ký Tự Có Dấu Thành Không Dấu
    slug = slug.replace(/á|à|ả|ã|ạ|ă|â|ắ|ằ|ẳ|ẵ|ặ|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/í|ỉ|ì|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ỏ|ò|õ|ọ|ơ|ô|ớ|ở|ờ|ỡ|ợ|ố|ổ|ồ|ỗ|ộ/gi, 'o');
    slug = slug.replace(/ú|ủ|ù|ũ|ụ|ư|ừ|ử|ừ|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỷ|ỳ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');

    //Xóa Ký Tự Đặc Biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\/|\?|\<|\>|\,|\.|\;|\"|\'|\[|\]|\{|\}|\:|\_|\\/gi, '');

    // //Đổi Khoảng Trằng Thành Khoảng Trắng
    // slug = slug.replace(/ /gi, '');

    //Phòng Trường Hợp Khách Hàng Nhập Nhiều Ký Tự Khoảng Trống
    slug = slug.replace(/\-{2,}/gi, '');

    //Xóa Các Ký Tự Gạch Ngang Ở Đầu Và Cuối
    slug = '@' + slug + '@'
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');

    return slug.replace(/[^a-zA-Z0-9 ]/g, " ");
  }
}
export const getRandomSalt = (length = 8): String => {
  let salt = "";
  const char_list = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789";
  for (let i = 0; i < length; i++)
    salt += char_list.charAt(Math.floor(Math.random() * char_list.length));

  return salt;
}
