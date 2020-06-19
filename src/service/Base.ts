import * as _ from 'lodash';
import { constant } from '../constant';
import { ObjectID } from 'bson'
import * as mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId

export default class Base {
  protected db
  private session
  protected currentUser

  constructor(db, session) {
    this.db = db
    this.session = session
    this.currentUser = session.user

    this.init()
  }

  protected init() { }

  public getDBModel(name: string) {
    return this.db.getModel(name)
  }

  protected getService<T extends Base>(service: { new(...args): T }): T {
    return new service(this.db, this.session)
  }

  protected buildService<T extends Base>(service: { new(...args): T }): T {
    return new service(this.db, this.session);
  }

  protected async markLastSeenComment(commentable, createdBy, db_commentable) {
    if (!this.currentUser) {
      return
    }

    if (commentable.comments && commentable.comments.length) {
      const subscriberInfo = _.find(commentable.subscribers, subscriber => {
        return (
          subscriber.user &&
          subscriber.user._id.toString() === this.currentUser._id.toString()
        )
      })

      if (subscriberInfo) {
        subscriberInfo.lastSeen = new Date()
      } else if (
        createdBy &&
        createdBy._id.toString() === this.currentUser._id.toString()
      ) {
        commentable.lastCommentSeenByOwner = new Date()
      }

      await db_commentable.update(
        { _id: commentable._id },
        {
          subscribers: commentable.subscribers,
          lastCommentSeenByOwner: commentable.lastCommentSeenByOwner
        }
      )
    }
  }

  /**
   * We trust this.currentUser because it was fetched during each request in the middleware
   * via a back-end encrypted token of the userId
   *
   * @returns {boolean}
   */
  protected isLoggedIn() {
    let isLoggedIn = false

    if (this.currentUser && this.currentUser._id) {
      isLoggedIn = true
    }

    return isLoggedIn
  }

  protected isAdmin() {
    return this.currentUser.role === constant.USER_ROLE.ADMIN
  }

  /**
   *  Base Function
   */
  public async create(param): Promise<Document> {

    let {
      dbModel,
      doc
    } = param;
    let DB = await this.getDBModel(`${dbModel}`);

    console.log(doc);

    const saveDoc = await DB.save(doc)

    return saveDoc;
  }

  public async update(param): Promise<Document> {
    let {
      dbModel
      , _id
      , doc
    } = param;
    let DB = await this.getDBModel(`${dbModel}`).getDBInstance();

    const query = { _id: ObjectId(_id) }
    const update = { $set: { ...doc } }

    const updateDoc = await DB
      .updateOne(query, update)

    return updateDoc
  }

  public async view(param) {
    let {
      dbModel,
      _id
    } = param;
    let DB = this.getDBModel(`${dbModel}`).getDBInstance();

    const view = await DB
      .findById(_id)

    if (!view)
      throw `_ID_NOT_FOUND, ${_id}`

    return view
  }

  public async deleteBase(param) {
    let {
      dbModel,
      _id,
      isDeleted
    } = param;
    let DB = this.getDBModel(`${dbModel}`).getDBInstance();

    if (!_id || !ObjectID.isValid(_id))
      throw "_ID_INVALID";
    // Check_Id
    const checkId = await DB
      .findById(_id);
    if (!checkId) throw "_ID_NOT_FOUND";

    isDeleted === false ? await DB
      .remove(
        { _id: ObjectId(_id) }
      )
      : await DB
        .updateOne(
          { _id: ObjectId(_id) },
          { $set: { isDeleted: true } }
        )

    return "DELETE_SUCCESSFULLY"
  }
  

}
