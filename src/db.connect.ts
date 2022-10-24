import { Sequelize } from 'sequelize-typescript'
import { Appointment } from '../model/appointment.model';

export const connect = () => {

    const hostName = 'localhost';
    const userName = 'postgres';
    const password = 'seniorproject';
    const database = 'public';
    const dialect = 'postgres';

    const sequelize = new Sequelize(database, userName, password, {
        host: hostName,
        dialect,
    });

    sequelize.addModels([Appointment]);

    const db: any = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    
    return db;

}