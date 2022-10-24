import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table
export class Appointment extends Model {
  
  @Column({ primaryKey: true, type: DataType.INTEGER })
  appointmentID!: number

  @Column({ type: DataType.INTEGER })
  patientID!: number

  @Column({ type: DataType.INTEGER })
  specialistID!: number;

  @Column({ type: DataType.INTEGER })
  roomID!: number

  @Column({ type: DataType.DATE })
  appointed_at!: Date;

  @Column({ type: DataType.STRING })
  comments!: string;

  @Column({ type: DataType.BOOLEAN })
  approved!: boolean;
  
}
