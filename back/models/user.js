module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // 테이블명은 users
    name: {
      type: DataTypes.STRING(100), // 20글자 이하
      allowNull: false, // 필수
    },
    userId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, // 고유한 값
    },
    password: {
      type: DataTypes.STRING(100), // 100글자 이하
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100), // 100글자 이하
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER, // 100글자 이하
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING(100), // 100글자 이하
      allowNull: false,
    },
    introduction: {
      type: DataTypes.STRING(100), // 100글자 이하
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글이 저장돼요
  });

  User.associate = (db) => {
    db.User.hasMany(db.Post, { as: 'Posts' })
    db.User.hasMany(db.Comment)
    db.User.hasMany(db.ProfileImage)
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' })
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' })
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' })
  };

  return User;
};
