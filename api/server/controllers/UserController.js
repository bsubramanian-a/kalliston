import UserService from "../services/UserService";
import Util from '../utils/Utils';
import bcrypt from 'bcrypt';
import user from "../src/models/user";

import jwt from 'jsonwebtoken'

//const util = new Util();

const createCoach = async (req, res) => {
  return res.json(200).send("coach check2")
  try {
    const { email } = req.body;

    const data = {
      email,
      password: await bcrypt.hash(Math.random().toString(36).slice(2,7)),
      user_type: 'coach'
    }

    const newCoach = await user.create(data);
    if (newCoach) {
      let token = jwt.sign({id: newCoach.id}, process.env.SECRET_KEY, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });
      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("newCoach", JSON.stringify(newCoach, null, 2));
      console.log(token);
      //send newCoach details
      return res.status(201).send(newCoach);
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.log(error)
  }
};

const coachLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
  } catch (error) {
    console.log(error)
  }
};

const forget = async (req, res) => {
  try {
    const { email, password } = req.body;
  } catch (error) {
    console.log(error)
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
  } catch (error) {
    console.log(error)
  }
};

export { createCoach, coachLogin, forget, updateProfile };



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