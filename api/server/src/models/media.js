module.exports = (sequelize, DataTypes) => {
  const Medias = sequelize.define('Medias', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    image: {
      allowNull: false,
      type: DataTypes.STRING
    },
    coach_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.ENUM,
      values: ['cover','media'],
      defaultValue:'media',
    },
  });
  return Medias;
}; 