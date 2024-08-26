import { DataTypes } from 'sequelize';
import sequelize from './config.js';  // Assure-toi d'importer correctement l'instance de Sequelize

const Post = sequelize.define('Post', {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Nom de la table des utilisateurs
      key: 'id',
    },
  },
}, {
  tableName: 'posts',
  timestamps: false,  // Si tu utilises des timestamps (createdAt, updatedAt), mets ce champ à true
});

export default Post;
