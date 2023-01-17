const Util = require('../utils/Utils');
const bcrypt = require('bcrypt');
const database = require('../src/models');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASSWORD
  }
});

const util = new Util();

const getPackages = async (req, res) => {
  try {
    const id = req.coachId;

    const packages = await database.PackageDetails.findAll({ where: { coach_id: id } });

    return res.status(200).send({
      data: packages,
      status: 200
    });
  } catch (error) {
    return res.status(401).send({
      message: error,
      status: 401
    });
  }
}

const addPackage = async (req, res) => {
  const id  = req.coachId;
  console.log("add package", req.body.data, id)
  let packages = req.body.data;

  try {
    // database.PackageDetails.bulkCreate(packages, 
    //   {
    //     updateOnDuplicate:['title', 'long_description', 'currency', 'amount', 'package_type', 'coach_id', 'type'] ,
    //       // updateOnDuplicate: ["coach_id", "package_type"] 
    //   })
    const { title, long_description, currency, amount, package_type } = packages;
    const epackage = await database.PackageDetails.findOne({where: {coach_id:id, package_type}});
  
    const data = {
      title, long_description, currency, amount, package_type, coach_id: id, type: 'published'
    }

    let add_package;
    // add_package = await database.PackageDetails.upsert(data);
    
    if(!epackage){
      add_package = await database.PackageDetails.create(data);
    }else{
      add_package = await database.PackageDetails.update(data,{ where: {coach_id:id, package_type}});
    }

    if (add_package) {
      return res.status(200).send({
        message: 'Package updated successfully',
        status: 200
      });
    } else {
      return res.status(401).send({
        message: 'Something went wrong, please try again later',
        status: 401
      });
    }
  } catch (error) {
    return res.status(401).send({
      message: error,
      status: 401
    });
  }
}

const updatePackage = async (req, res) => {
  try {
    const id  = req.coachId;

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
    const coach = await database.User.findOne({where: {id}});

    if (coach) {
      const update_profile = await database.User.update(
        { email : email ?? undefined, 
          gender : gender ?? undefined, 
          dob : dob ?? undefined,
          firstname : firstname ?? undefined, 
          lastname : lastname ?? undefined, 
          email_notification : email_notification ?? undefined,
          client_request_notification : client_request_notification ?? undefined,
          message_from_client : message_from_client ?? undefined,
          two_factor_auth : two_factor_auth ?? undefined,
          sync_google : sync_google ?? undefined,
          cal : cal ?? undefined,
          bio : bio ?? undefined,
          otp_required: otp_required ?? undefined,
          customized_link : customized_link ?? undefined,
          website_link : website_link ?? undefined,
          instagram_link : instagram_link ?? undefined,
          facebook_link : facebook_link ?? undefined,
          tiktok_link : tiktok_link ?? undefined,
          youtube_link : youtube_link ?? undefined,
          cover_image : cover_image ?? undefined,
          user_type : user_type ?? undefined,
          your_goal : your_goal ?? undefined,
          current_fitness_level : current_fitness_level ?? undefined,
          latitude : latitude ?? undefined,
          longitude : longitude ?? undefined,
          billing_address1 : billing_address1 ?? undefined,
          billing_address2 : billing_address2 ?? undefined,
          city : city ?? undefined,
          country : country ?? undefined,
          experience : experience ?? undefined,
          certifications : certifications ?? undefined,
          areas_of_interest : areas_of_interest ?? undefined,
          long_description : long_description ?? undefined
        },
        {where:{id:coach.id}}
      );
      console.log("update_profile",update_profile)
      if (update_profile) {
        const coach = await database.User.findOne({where: {id}});
        const url = req.get('host');
        if(coach.avatar) coach.avatar = 'http://' +url + '/coach/images/' + coach.avatar;
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

const deletePackage = () => {

}

module.exports = { getPackages, addPackage, updatePackage, deletePackage };
