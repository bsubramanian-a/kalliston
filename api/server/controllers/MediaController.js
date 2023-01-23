const database = require('../src/models');

const getCoachMedias = async (req, res) => {
  // console.log("getCoachMedias");
  try {
    const id = req.coachId;
    // console.log("coach_id", id);

    const medias = await database.Medias.findAll({ where: { coach_id: id },  order: [
      ['createdAt', 'DESC'],
    ], });

    medias?.map((media) => {
      const url = req.get('host');
      if (media.image) media.image = 'http://' + url + '/coach/images/' + media.image;
    })

    return res.status(200).send({
      data: medias,
      status: 200
    });
  } catch (error) {
    console.log("error.......", error);
    return res.status(401).send({
      message: error,
      status: 401
    });
  }
}

const coachUpdateMediaImage = async (req, res) => {
  // console.log("req----------------", req.body.type);
  if (req.file) {
    try {
      const id  = req.coachId;
  
      const data = {
        image: req.file.filename, coach_id: id, type: 'media'
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

const coachDeleteMediaImage = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const mediaToDelete = await database.Medias.findOne({ where: { id: Number(id) } });
      // console.log("mediaToDelete", mediaToDelete)
      if (mediaToDelete) {
        // console.log("media to delete")
        const deletedMedia = await database.Medias.destroy({
          where: { id: Number(id) }
        });
       
        return res.status(200).send({
          message: "Media deleted successfully",
          status: 200
        });
      }
      return res.status(401).send({
        message: 'Something went wrong please try again later',
        status: 401
      });
    } catch (error) {
      // console.log("delete error.......", error);
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

module.exports = { coachUpdateMediaImage, coachDeleteMediaImage, getCoachMedias };
