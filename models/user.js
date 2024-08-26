import { DataTypes } from 'sequelize';
import sequelize  from '../config.js'; // Assure-toi que le chemin est correct

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  coverPicture: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  profilePicture: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  city: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING(45),
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: false // Assure que les champs createdAt et updatedAt ne sont pas utilisés
});

export default User;
