const Util = require('../utils/Utils');
const bcrypt = require('bcrypt');
const database = require('../src/models');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'crtvecode@gmail.com',
    pass: 'sbyvkjdckqtosuhm'
  }
});

const util = new Util();

const getCardDetails = async (req, res) => {
    try {
      const id  = req.coachId;
  
      const card = await database.CardDetail.findOne({where: {user_id: id}});
      console.log("card details", card)
      return res.status(401).send({
        card: card,
        status: 401
      });
    } catch (error) {
      return res.status(401).send({
        message: error,
        status: 401
      });
    }
  }
  
  const addCard = async (req, res) => {
    try {
      const id  = req.coachId;
  
      const card = await database.CardDetail.findOne({where: {user_id: id}});
      console.log("card", card);
  
      if(card){
        const update_profile = await database.CardDetail.update(
          { 
            card_number, card_holder_name, expiry_date, cvv, billing_address1, billing_address2, city, country
        }, {where:{id: id}});
  
        if(update_profile){
          return res.status(200).send({
            card: card,
            message: 'Card updated successfully',
            status: 200
          });
        }else{
          return res.status(401).send({
            message: 'Something went wrong, please try again later',
            status: 401
          });
        }
      }else{
        console.log("create")
        const data = {
          card_number, card_holder_name, expiry_date, cvv, billing_address1, billing_address2, city, country, user_id: id
        }
        try {
          return await database.CardDetail.create(data);
        } catch (error) {
          throw error;
        }
    
        const createcard = await database.CardDetail.create(data).then(res => {
          console.log("create res", res);
        }) .catch(err => console.error(err))
        .then(() => process.exit());
        console.log("created");
        if(createcard){
          return res.status(200).send({
            card: card,
            message: 'Card added successfully',
            status: 200
          });
        }else{
          return res.status(401).send({
            message: 'Something went wrong, please try again later',
            status: 401
          });
        }
      }
      
    } catch (error) {
      return res.status(401).send({
        message: error,
        status: 401
      });
    }
  }

  module.exports = { getCardDetails, addCard };
