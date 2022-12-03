import express from 'express';
import user from '../src/models/user';

const checkCoachAlreadyExist = async (req,res, next) => {
    return res.json(200).send("coach check")
    try {
        const email = await user.findOne({
          where: {
            email: req.body.email,
            user_type: 'coach'
          },
        });
        //if email exist in the database respond with a status of 409
        if (email) {
          return res.json(409).send("coach email already taken");
        }
        next();
      } catch (error) {
        console.log(error);
      }
};

 
export { checkCoachAlreadyExist };
