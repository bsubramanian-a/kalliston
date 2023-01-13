module.exports = (sequelize, DataTypes) => {
  const PackageDetails = sequelize.define('PackageDetails', {    
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ['usd', 'gbp', 'euro'],
    },
    amount: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    long_description: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    access_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    program_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    coach_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    package_type: {
      type: DataTypes.ENUM,
      values: ['basic', 'premium', 'elite'],
      defaultValue:'basic'
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
  return PackageDetails;
};