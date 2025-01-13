import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('cinema', 'root', 'password123', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432
}); 