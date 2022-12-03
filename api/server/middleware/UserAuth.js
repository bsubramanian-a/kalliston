import express from 'express';
import user from '../src/models/user';

const saveUser = async (req,res, next) => {
    try {
        const email = await user.findOne({
          where: {
            email: req.body.email,
          },
        });
        //if email exist in the database respond with a status of 409
        if (email) {
          return res.json(409).send("email already taken");
        }
        next();
      } catch (error) {
        console.log(error);
      }
};

 
export default saveUser;
