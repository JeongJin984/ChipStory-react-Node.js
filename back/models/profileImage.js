module.exports = (sequelize, DataTypes) => {
	const ProfileImage = sequelize.define('ProfileImage', {
		src: {
			type: DataTypes.STRING(200),
			allowNull: true
		}
	}, {
		charset: 'utf8',
		collate: 'utf8_general_ci'
	})
	ProfileImage.associate = (db) => {
		db.ProfileImage.belongsTo(db.User);
	}
	return ProfileImage
} 