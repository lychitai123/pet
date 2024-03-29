import { Request, Response, NextFunction, Router } from 'express';
import { getEnv } from '../utility';
import db from '../db';
import { utilCrypto } from '../utility';
import * as moment from 'moment';

// Routes to Index
import baseFunction from './Base_Function/index';
import user from './user';
import placeOfWork from './PlaceOfWork/index';

/**
 * Every request intercepts the token and sets the session user from the userId again
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {boolean}
 */
export const middleware = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   // check token
   const token = req.headers['api-token'];
   const DB = await db.create();

   if (token) {
      const json = JSON.parse(utilCrypto.decrypt(token.toString()));
      if (json.userId && json.expired && json.expired - moment().unix() > 0) {
         try {
            const user = await DB.getModel('User').findOne({
               _id: json.userId,
            });
            // TODO: find better way to not send the salt back to the front-end

            if (user) {
               delete user._doc.salt;
               req['session'].user = user;
               req['session'].userId = user.id;
            }
         } catch (err) {
            console.log('err happened: ', err);
         }
      }
   } else if (req['session'].userId) {
      // check session
      const session = req['session'];
      try {
         const user = await DB.getModel('User').findOne({
            _id: session.userId,
         });

         if (user) {
            req['session'].user = user;
         }
      } catch (err) {
         console.log('err happened: ', err);
      }
   }
   next();
};

const router = Router();

// if (getEnv() === 'dev') {
//     router.use('/test', test)
// }

// Route Base_Function
router.use('/base', baseFunction);
// Route CMS
router.use('/user', user);
// PlaceOfWork
router.use('/placeOfWork', placeOfWork);

router.use((req, res) => {
   return res.sendStatus(403);
});

export default router;
