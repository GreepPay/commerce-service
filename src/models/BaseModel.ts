import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

export function getDateTimeType() {
  return process.env.APP_STATE === "test" ? "datetime" : "timestamp";
}

export function getEnumType() {
  return process.env.APP_STATE === "test" ? "text" : "enum";
}

export function getJsonType() {
  return process.env.APP_STATE === "test" ? "text" : "jsonb";
}

export abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
