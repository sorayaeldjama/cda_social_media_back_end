import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('social_bdd', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;
