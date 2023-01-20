const database = require('../src/models');

const coachUpdateCoverImage = async (req, res) => {
  // console.log("req----------------", req.body.type);
  if (req.file) {
    try {
      const id  = req.coachId;
  
        const data = {
          image: req.file.filename, coach_id: id, type: req.body.type
        }
        // console.log("data.........", data)

        const addMedia = await database.Medias.create(data);

        if(addMedia){
          return res.status(200).send({
            message: "Success",
            status: 200
          });
        }
       
        // console.log("after addMedia", addMedia);
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

module.exports = { coachUpdateCoverImage };
