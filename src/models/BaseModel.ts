import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Generated,
  Column,
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

  @Column({ type: "uuid" })
  @Generated("uuid")
  uuid!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
