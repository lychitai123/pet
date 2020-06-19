import * as mongoose from 'mongoose';

// Schemna
import User from './User';
import UserManage from './UserManagement'

import { utilCrypto } from '../utility'
import * as uuid from 'uuid'

export default class {
  protected db: any
  public connection: mongoose.ConnectionBase
  public mongodbDriver;

  constructor() {
    this.db = {}
  }

  public isConnected(): boolean {
    return this.connection && this.connection.readyState === 1
  }

  public async start(): Promise<mongoose.ConnectionBase> {
    console.log('----------------------------------------');
    const url = process.env.DB_URL || 'mongodb://localhost:27017/portfolio';
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
    const db = await mongoose.createConnection(url, options)

    this.connection = db;
    this.mongodbDriver = this.connection.db

    // Setup callback
    await this.connection.on('error', this.handleDBError);

    await this.connection.on('disconnected', this.handleUnexpectedDisconnect);

    await this.connection.on('reconnected', function () {
      console.log('MongoDB reconnected!');
    });

    await this.initDB(db);
    // await this.prepareRecord();
    return await db;
  }

  private handleDBError() {
    return (error: any) => {
      console.log('Error is happenning', error)
    }
  }

  private handleUnexpectedDisconnect() {
    console.log('handleUnexpectedDisconnect')

    return (error: any) => {
      console.error('mongodb is disconnect', error)
      setTimeout(() => {
        this.start()
      }, 5000)
    }
  }

  public disconnect() {
    mongoose.connection.close()
  }

  private async initTest() {
    const u = await this.db.Test.find({})
    if (u.length < 1) {
      const rs = await this.db.Test.save({
        name: 'test',
        age: 100,
        time: Date.now()
      })
    }
  }

  private initDB(db) {
    this.db.User = new User(db);
    this.db.UserManage = new UserManage(db);
  }

  public getModel(name: string) {
    const rs = this.db[name]
    if (!rs) {
      throw new Error('invalid model name : ' + name)
    }
    return rs
  }

  // private async prepareRecord() {
  //   // create admin user
  //   const salt = uuid.v4()
  //   const password = utilCrypto.sha512(process.env.ADMIN_PASSWORD + salt)
  //   const doc = {
  //     username: process.env.ADMIN_USERNAME,
  //     password,
  //     salt,
  //     email: 'admin@ebp.com',
  //     role: 'ADMIN',
  //     active: true,
  //     profile: {
  //       firstName: 'Admin',
  //       lastName: 'Ebp',
  //       region: {
  //         country: 'China',
  //         city: ''
  //       }
  //     }
  //   }
  //   try {
  //     const rs = await this.db.User.save(doc)
  //     console.log('create admin user =>', rs)
  //   } catch (err) {
  //     if (err.code === 11000) {
  //       console.log('admin user already exists')
  //     } else {
  //       console.error(err)
  //     }
  //   }
  // }
}
