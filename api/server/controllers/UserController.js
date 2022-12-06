import UserService from "../services/UserService";
import Util from '../utils/Utils';
import bcrypt from 'bcrypt';
import database from '../src/models';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'crtvecode@gmail.com',
    pass: 'sbyvkjdckqtosuhm'
  }
});

const util = new Util();

const createCoach = async (req, res) => {
  try {
    const { email } = req.body;
    const passwordTOSend = Math.random().toString(36).slice(2,7);

    const data = {
      email,
      password: await bcrypt.hashSync(passwordTOSend, 10),
      user_type: 'coach'
    }

    const newCoach = await database.User.create(data);
    if (newCoach) {
      let token = jwt.sign({id: newCoach.id}, process.env.SECRET_KEY, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });
      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("newCoach", JSON.stringify(newCoach, null, 2));
      console.log(token);

      const mailOptions = {
        from: 'crtvecode@gmail.com',
        to: email,
        subject: 'Login Credentials',
        text: `Email : ${email}, Password : ${passwordTOSend}`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          return res.status(201).send({
            status: "success" 
          });
        }
      });
    } else {
      return res.status(409).send({
        status: "error" 
      });
    }
  } catch (error) {
    //console.log(error)
    return res.status(409).send({
      status: "error" 
    });
  }
};

const coachLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const coach = await database.User.findOne({where: {email}});

    if (coach) {
      const isPasswordSame = await bcrypt.compareSync(password, coach.password);      
      if (isPasswordSame) {        

        //generate otp
        const otp_to_login = Math.floor(100000 + Math.random() * 900000);
        
        const update_otp = await database.User.update(
          {otp_to_login},
          {where:{id:coach.id}}
        );

        if (update_otp) {
          const mailOptions = {
            from: 'crtvecode@gmail.com',
            to: email,
            subject: 'Security Code to Login',
            text: `Security Code : ${otp_to_login}`
          };
    
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              return res.status(201).send({
                status: "success" 
              });
              //return res.status(201).send(token);
              // do something useful
            }
          });
        } else {
          return res.status(401).send({
            status: "OTP error" 
          });
        }
      } else {
        return res.status(401).send({
          status: "Password not correct" 
        });
      }
    } else {
      return res.status(401).send({
        status: "Email does not exist." 
      });
    }

  } catch (error) {
    console.log(error)
    return res.status(401).send({
      status: "error" 
    });
  }
};
const coachForgetPassword = async (req, res) => {  
  try {
    const { email } = req.body;
    const coach = await database.User.findOne({where: {email}});
    console.log("coach", coach);
    if (coach) {
      const otp_to_forget = Math.floor(100000 + Math.random() * 900000);
        
        const update_otp_forget = await database.User.update(
          {otp_to_forget},
          {where:{id:coach.id}}
        );

        if (update_otp_forget) {
          const mailOptions = {
            from: 'crtvecode@gmail.com',
            to: email,
            subject: 'Security Code to Forget Password',
            text: `Security Code : ${otp_to_forget}`
          };
    
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              return res.status(201).send({
                status: "success" 
              });
              // do something useful
            }
          });
        } else {
          return res.status(401).send({
            status: "OTP error" 
          });
        }
    } else {
      return res.status(401).send({
        status: "Email does not exist." 
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(401).send({
      status: "error" 
    });
  }
}

const checkOTP = async (req, res) => {  
  try {
    const { email, otp } = req.body;
    const coach = await database.User.findOne({where: {email}});
    if (coach) {
      if (otp == coach.otp_to_login) {

        let token = jwt.sign({ id: coach.id }, process.env.SECRET_KEY, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(coach, null, 2));
        console.log(token);

        const update_otp = await database.User.update(
          {otp_to_login: null},
          {where:{id:coach.id}}
        );
        if (update_otp) {
          return res.status(201).send({
            status: "success",
            coach,
            token 
          });
          //return res.status(200).send("success");
        } else {
          return res.status(401).send({
            status: "Login OTP error." 
          });
        }
      } else {
        return res.status(401).send({
          status: "Login OTP is not valid." 
        });
      }
    } else {
      return res.status(401).send({
        status: "Email does not exist." 
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      status: "some error" 
    });
  }
}

const checkOTPForget = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const coach = await database.User.findOne({where: {email}});
    if (coach) {
      if (otp == coach.otp_to_forget) {
        const update_otp_forget = await database.User.update(
          {otp_to_forget: null},
          {where:{id:coach.id}}
        );
        if (update_otp_forget) {
          const passwordTOSend = Math.random().toString(36).slice(2,7);
          const password_update = await database.User.update(
            {password: await bcrypt.hashSync(passwordTOSend, 10)},
            {where:{id:coach.id}}
          );
          if (password_update) {
            const mailOptions = {
              from: 'crtvecode@gmail.com',
              to: email,
              subject: 'Your New Password',
              text: `Password : ${passwordTOSend}`
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).send("success");
                // do something useful
              }
            });
          } else {
            return res.status(401).send("Password update error.");  
          }
        } else {
          return res.status(401).send("Forget OTP error.");
        }
      } else {
        return res.status(401).send("Forget OTP is not valid.");
      }
    } else {
      return res.status(401).send("Email does not exist.");
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send("some error");
  }
}

const coachChangePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const coach = await database.User.findOne({where: {email}});
    if (coach) {
      const password_update = await database.User.update(
        {password: await bcrypt.hashSync(password, 10)},
        {where:{id:coach.id}}
      );
      if (password_update) {
        const mailOptions = {
          from: 'crtvecode@gmail.com',
          to: email,
          subject: 'Your New Password Updated Successfully',
          text: `Password : ${password}`
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).send("success");
            // do something useful
          }
        });
      } else {
        return res.status(401).send("New Password update error.");  
      }
    } else {
      return res.status(401).send("Email does not exist.");
    }
  } catch (error) {
    console.log(error)
  }
}

const coachUpdateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id",id);
    const { 
      email, 
      gender, 
      dob, 
      avatar, 
      firstname, 
      lastname, 
      email_notification,
      client_request_notification,
      message_from_client,
      two_factor_auth,
      sync_google,cal,
      bio,
      customized_link,
      website_link,
      instagram_link,
      facebook_link,
      tiktok_link,
      youtube_link,
      cover_image,
      user_type,
      your_goal,
      current_fitness_level,
      latitude,
      longitude,
      billing_address1,
      billing_address2,
      city,
      country,
      experience,
      certifications,
      areas_of_interest,
      long_description,
      createdAt,
      updatedAt  
    } = req.body;
    const coach = await database.User.findOne({where: {id}});
    console.log(coach);
    if (coach) {
      const update_profile = await database.User.update(
        {gender},
        {where:{id:coach.id}}
      );
      if (update_profile) {
        return res.status(200).send("profile updated")
      }
    } else {
      return res.status(401).send("Email does not exist.");
    }
  } catch (error) {
    console.log(error)
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserService.getAllUsers();
    if (allUsers.length > 0) {
      util.setSuccess(200, 'Users retrieved', allUsers);
    } else {
      util.setSuccess(200, 'No user found');
    }
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
}

export { createCoach, coachLogin, coachForgetPassword, coachUpdateProfile, getAllUsers, checkOTP, checkOTPForget, coachChangePassword };



// class UserController {
//   static async getAllUsers(req, res) {
//     try {
//       const allUsers = await UserService.getAllUsers();
//       if (allUsers.length > 0) {
//         util.setSuccess(200, 'Users retrieved', allUsers);
//       } else {
//         util.setSuccess(200, 'No user found');
//       }
//       return util.send(res);
//     } catch (error) {
//       util.setError(400, error);
//       return util.send(res);
//     }
//   }

//   static async addUser(req, res) {
//     if (!req.body.email || !req.body.password || !req.body.gender) {
//       util.setError(400, 'Please provide complete details');
//       return util.send(res);
//     }
//     const newUser = req.body;
//     try {
//       const createdUser = await UserService.addUser(newUser);
//       util.setSuccess(201, 'User Added!', createdUser);
//       return util.send(res);
//     } catch (error) {
//       util.setError(400, error.message);
//       return util.send(res);
//     }
//   }

//   static async updatedUser(req, res) {
//     const alteredUser = req.body;
//     const { id } = req.params;
//     if (!Number(id)) {
//       util.setError(400, 'Please input a valid numeric value');
//       return util.send(res);
//     }
//     try {
//       const updateUser = await UserService.updateUser(id, alteredUser);
//       if (!updateUser) {
//         util.setError(404, `Cannot find user with the id: ${id}`);
//       } else {
//         util.setSuccess(200, 'User updated', updateUser);
//       }
//       return util.send(res);
//     } catch (error) {
//       util.setError(404, error);
//       return util.send(res);
//     }
//   }

//   static async getAUser(req, res) {
//     const { id } = req.params;

//     if (!Number(id)) {
//       util.setError(400, 'Please input a valid numeric value');
//       return util.send(res);
//     }

//     try {
//       const theUser = await UserService.getAUser(id);

//       if (!theUser) {
//         util.setError(404, `Cannot find user with the id ${id}`);
//       } else {
//         util.setSuccess(200, 'Found User', theUser);
//       }
//       return util.send(res);
//     } catch (error) {
//       util.setError(404, error);
//       return util.send(res);
//     }
//   }

//   static async deleteUser(req, res) {
//     const { id } = req.params;

//     if (!Number(id)) {
//       util.setError(400, 'Please provide a numeric value');
//       return util.send(res);
//     }

//     try {
//       const userToDelete = await UserService.deleteUser(id);

//       if (userToDelete) {
//         util.setSuccess(200, 'User deleted');
//       } else {
//         util.setError(404, `User with the id ${id} cannot be found`);
//       }
//       return util.send(res);
//     } catch (error) {
//       util.setError(400, error);
//       return util.send(res);
//     }
//   }
// }

// export default UserController;