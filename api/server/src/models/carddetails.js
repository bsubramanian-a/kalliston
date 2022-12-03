module.exports = (sequelize, DataTypes) => {
  const CardDetail = sequelize.define('CardDetail', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    card_number: {
      type: DataTypes.STRING
    },
    card_holder_name: {
      type: DataTypes.STRING
    },
    expiry_date: {
      type: DataTypes.DATE
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });
  return CardDetail;
};