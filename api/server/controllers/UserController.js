const UserService = require("../services/UserService");
const Util = require('../utils/Utils');
const bcrypt = require('bcrypt');
const database = require('../src/models');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const { SEND_MAIL_CONFIG } = require('../utils/imap')

const transporter = nodemailer.createTransport(SEND_MAIL_CONFIG);

const util = new Util();

const getCoach = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const coach = await database.User.findOne({ where: { id } });
      const url = req.get('host');

      if (coach.avatar) coach.avatar = 'http://' + url + '/coach/images/' + coach.avatar;
      if (coach.cover_image) coach.cover_image = 'http://' + url + '/coach/images/' + coach.cover_image;
      
      return res.status(200).send({
        data: coach,
        status: 200,
      });
    } else {
      return res.status(401).send("no coach");
    }
  } catch (error) {
    //console.log(error)
    return res.status(409).send({
      status: error
    });
  }
}

const createCoach = async (req, res) => {


  try {
    const { email } = req.body;
    const passwordTOSend = Math.random().toString(36).slice(2, 7);

    const data = {
      email,
      password: await bcrypt.hashSync(passwordTOSend, 10),
      user_type: 'coach'
    }

    const newCoach = await database.User.create(data);
    if (newCoach) {
      let token = jwt.sign({ id: newCoach.id }, process.env.SECRET_KEY, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });
      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("newCoach", JSON.stringify(newCoach, null, 2));
      console.log(token);

      const time = new Date().toString();
      let info = await transporter.sendMail({
        from: SEND_MAIL_CONFIG.auth.user,
        to: email,
        subject: 'Login Credentials from Kalliston',
        html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Login Credentials :</h2>
          <p>Email : ${email}</p>
          <p>Password : ${passwordTOSend}</p>
          <p>sent at ${time}</p>
        </div>
      `,
      }, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          return res.status(201).send({
            status: "success"
          });
        }
      });
      console.log(`MAIL INFO: ${info}`);
      console.log(`MAIL SENT AT: ${time}`);

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
    const coach = await database.User.findOne({ where: { email } });

    if (coach) {
      const isPasswordSame = await bcrypt.compareSync(password, coach.password);
      if (isPasswordSame) {

        //generate otp
        const otp_to_login = Math.floor(100000 + Math.random() * 900000);

        const update_otp = await database.User.update(
          { otp_to_login },
          { where: { id: coach.id } }
        );

        if (update_otp) {
          const time = new Date().toString();
          let info = await transporter.sendMail({
            from: SEND_MAIL_CONFIG.auth.user,
            to: email,
            subject: 'Security Code to Login Kalliston',
            html: `
            <div
              class="container"
              style="max-width: 90%; margin: auto; padding-top: 20px"
            >
              <h2>Your Security Code to do the login :</h2>
              <p>Security Code : ${otp_to_login}</p>
              <p>sent at ${time}</p>
            </div>
          `,
          }, function (error, info) {
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
          console.log(`MAIL INFO: ${info}`);
          console.log(`MAIL SENT AT: ${time}`);
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
    const coach = await database.User.findOne({ where: { email } });
    console.log("coach", coach);
    if (coach) {
      const otp_to_forget = Math.floor(100000 + Math.random() * 900000);

      const update_otp_forget = await database.User.update(
        { otp_to_forget },
        { where: { id: coach.id } }
      );

      if (update_otp_forget) {

        const time = new Date().toString();
        let info = await transporter.sendMail({
          from: SEND_MAIL_CONFIG.auth.user,
          to: email,
          subject: 'Security Code to Forget Password from Kalliston',
          html: `
            <div
              class="container"
              style="max-width: 90%; margin: auto; padding-top: 20px"
            >
              <h2>Your Security Code for forget password :</h2>
              <p>Security Code : ${otp_to_forget}</p>
              <p>sent at ${time}</p>
            </div>
          `,
        }, function (error, info) {
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
        console.log(`MAIL INFO: ${info}`);
        console.log(`MAIL SENT AT: ${time}`);
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
    const { email, otp } = req.body.data;
    // console.log("email", email, otp)
    const coach = await database.User.findOne({ where: { email } });
    console.log("coach", coach);
    if (coach) {
      if (otp == coach.otp_to_login) {

        let token = jwt.sign({ id: coach.id }, process.env.SECRET_KEY, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(coach, null, 2));
        console.log(token);

        const update_otp = await database.User.update(
          { otp_to_login: null },
          { where: { id: coach.id } }
        );
        if (update_otp) {
          const url = req.get('host');
          if (coach.avatar) coach.avatar = 'http://' + url + '/coach/images/' + coach.avatar;
          return res.status(201).send({
            status: "success",
            coach,
            token
          });
          //return res.status(200).send("success");
        } else {
          return res.status(401).send({
            message: "Login OTP error.",
            status: 401
          });
        }
      } else {
        return res.status(401).send({
          message: "Login OTP is not valid.",
          status: 401
        });
      }
    } else {
      return res.status(401).send({
        message: "Email does not exist.",
        status: 401
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      message: "some error.",
      status: 401
    });
  }
}

const checkOTPForget = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const coach = await database.User.findOne({ where: { email } });
    if (coach) {
      if (otp == coach.otp_to_forget) {
        const update_otp_forget = await database.User.update(
          { otp_to_forget: null },
          { where: { id: coach.id } }
        );
        if (update_otp_forget) {
          const passwordTOSend = Math.random().toString(36).slice(2, 7);
          const password_update = await database.User.update(
            { password: await bcrypt.hashSync(passwordTOSend, 10) },
            { where: { id: coach.id } }
          );
          if (password_update) {

            const time = new Date().toString();
            let info = await transporter.sendMail({
              from: SEND_MAIL_CONFIG.auth.user,
              to: email,
              subject: 'Your New Password To Login Kalliston',
              html: `
            <div
              class="container"
              style="max-width: 90%; margin: auto; padding-top: 20px"
            >
              <h2>Your New Password To Login Kalliston</h2>
              <p>Password : ${passwordTOSend}</p>
              <p>sent at ${time}</p>
            </div>
          `,
            }, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).send({
                  status: "success"
                });
              }
            });
            console.log(`MAIL INFO: ${info}`);
            console.log(`MAIL SENT AT: ${time}`);

          } else {
            return res.status(401).send({
              status: "Password update error."
            });
          }
        } else {
          return res.status(401).send({
            status: "Forget OTP error."
          });
        }
      } else {
        return res.status(401).send({
          status: "Forget OTP is not valid."
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

const coachChangePassword = async (req, res) => {
  try {
    const { email, currentpassword, newpassword } = req.body;
    const coach = await database.User.findOne({ where: { email } });
    if (coach) {
      console.log("oldpassword", currentpassword);
      console.log("coach.password", coach.password);
      const isPasswordSame = await bcrypt.compareSync(currentpassword, coach.password);
      if (isPasswordSame) {
        const password_update = await database.User.update(
          { password: await bcrypt.hashSync(newpassword, 10) },
          { where: { id: coach.id } }
        );
        if (password_update) {

          const time = new Date().toString();
            let info = await transporter.sendMail({
              from: SEND_MAIL_CONFIG.auth.user,
              to: email,
              subject: 'Your New Password Updated Successfully',
              html: `
            <div
              class="container"
              style="max-width: 90%; margin: auto; padding-top: 20px"
            >
              <h2>Your New Password Updated Successfully</h2>
              <p>Your new Password : ${newpassword}</p>
              <p>sent at ${time}</p>
            </div>
          `,
            }, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).send({
                  message: "Password changed successfully",
                  status: 200
                });
              }
            });
            console.log(`MAIL INFO: ${info}`);
            console.log(`MAIL SENT AT: ${time}`);
        } else {
          return res.status(401).send({
            message: "New Password update error.",
            status: 401
          });
        }
      } else {
        return res.status(401).send({
          status: 401,
          message: "Old password is not correct."
        });
      }
    } else {
      return res.status(401).send({
        status: 401,
        message: "Email does not exist."
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(401).send({
      status: 401,
      message: "error"
    });
  }
}

const coachUpdateProfilePic = async (req, res) => {
  console.log("coachUpdateProfilePic", req.file.filename);
  try {
    const id = req.coachId;
    const coach = await database.User.findOne({ where: { id } });
    if (coach) {
      if (req.file) {
        const update_profile = await database.User.update(
          { avatar: req.file.filename },
          { where: { id } }
        );
        if (update_profile) {
          const coach = await database.User.findOne({ where: { id } });
          const url = req.get('host');
          console.log("url", url);
          if (coach.avatar) coach.avatar = 'http://' + url + '/coach/images/' + coach.avatar;
          return res.status(200).send({
            message: "Profile picture updated successfully",
            coach: coach,
            status: 200
          });
        } else {
          return res.status(401).send({
            message: "Something went wrong, please try again later",
            status: 401
          });
        }

      } else {
        return res.status(401).send({
          message: "Please select an image to upload",
          status: 401
        });
      }
    } else {
      return res.status(401).send({
        message: "User does not exist.",
        status: 401
      });
    }

  } catch (error) {
    console.log(error)
    return res.status(401).send({
      status: 401,
      message: error
    });
  }
}

const coachUpdateCoverImage = async (req, res) => {
  // console.log("req----------------", req.body.type);
  if (req.file) {
    try {
      const id  = req.coachId;

      // console.log("data.........", data)
      const coach = await database.User.findOne({ where: { id } });

      const addMedia = await database.User.update(
        { cover_image: req.file.filename },
        { where: { id: id } }
      );
      
      if(addMedia){
        return res.status(200).send({
          message: "Success",
          status: 200
        });
      }
       
      console.log("after addMedia", addMedia);
    } catch (error) {
      return res.status(401).send({
        message: error,
        status: 401
      });
    }
  } else {
    return res.status(401).send({
      message: "Please select an image to upload",
      status: 401
    });
  }
}

const coachUpdateProfile = async (req, res) => {
  try {
    const id = req.coachId;

    const {
      email,
      gender,
      dob,
      firstname,
      lastname,
      email_notification,
      client_request_notification,
      message_from_client,
      two_factor_auth,
      sync_google,
      cal,
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
      otp_required
    } = req.body;
    const coach = await database.User.findOne({ where: { id } });

    if (coach) {
      const update_profile = await database.User.update(
        {
          email: email ?? undefined,
          gender: gender ?? undefined,
          dob: dob ?? undefined,
          firstname: firstname ?? undefined,
          lastname: lastname ?? undefined,
          email_notification: email_notification ?? undefined,
          client_request_notification: client_request_notification ?? undefined,
          message_from_client: message_from_client ?? undefined,
          two_factor_auth: two_factor_auth ?? undefined,
          sync_google: sync_google ?? undefined,
          cal: cal ?? undefined,
          bio: bio ?? undefined,
          otp_required: otp_required ?? undefined,
          customized_link: customized_link ?? undefined,
          website_link: website_link ?? undefined,
          instagram_link: instagram_link ?? undefined,
          facebook_link: facebook_link ?? undefined,
          tiktok_link: tiktok_link ?? undefined,
          youtube_link: youtube_link ?? undefined,
          cover_image: cover_image ?? undefined,
          user_type: user_type ?? undefined,
          your_goal: your_goal ?? undefined,
          current_fitness_level: current_fitness_level ?? undefined,
          latitude: latitude ?? undefined,
          longitude: longitude ?? undefined,
          billing_address1: billing_address1 ?? undefined,
          billing_address2: billing_address2 ?? undefined,
          city: city ?? undefined,
          country: country ?? undefined,
          experience: experience ?? undefined,
          certifications: certifications ?? undefined,
          areas_of_interest: areas_of_interest ?? undefined,
          long_description: long_description ?? undefined
        },
        { where: { id: coach.id } }
      );
      console.log("update_profile", update_profile)
      if (update_profile) {
        const coach = await database.User.findOne({ where: { id } });
        const url = req.get('host');
        if (coach.avatar) coach.avatar = 'http://' + url + '/coach/images/' + coach.avatar;
        return res.status(200).send({
          message: "profile updated",
          coach,
          status: 200
        });
      }
    } else {
      return res.status(401).send({
        message: "Email does not exist.",
        status: 401
      });
    }
  } catch (error) {
    console.log("Error", error);
    return res.status(401).send({
      message: error,
      status: 401
    });
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

const coachDeleteCoverImage = async (req, res) => {
  try {
    const { id } = req.coachId;

    try {
      const user = await database.User.findOne({ where: { id: Number(id) } });

      if (user) {
        const deleteCoverImage = await database.User.update(
          { cover_image: "" },
          { where: { id: id } }
        );
       
        return res.status(200).send({
          message: "Cover Image deleted successfully",
          status: 200
        });
      }
      return res.status(401).send({
        message: 'Something went wrong please try again later',
        status: 401
      });
    } catch (error) {
      console.log("delete error.......", error);
      throw error;
    }
    // console.log("after addMedia", addMedia);
  } catch (error) {
    return res.status(401).send({
      message: error,
      status: 401
    });
  }
}

module.exports = { createCoach, coachLogin, coachForgetPassword, coachUpdateProfile, getAllUsers, checkOTP, checkOTPForget, coachChangePassword, coachUpdateProfilePic, getCoach, coachUpdateCoverImage, coachDeleteCoverImage };



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