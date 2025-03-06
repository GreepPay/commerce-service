import { DataSource } from "typeorm";
import { User } from "./models/User";
import fs from "fs";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [],
  // entities: ["src/models/**/*.ts"],
  subscribers: [],
  ssl:
    process.env.DB_USE_SSL === "true"
      ? {
          rejectUnauthorized: true,
          ca: fs
            .readFileSync(__dirname + "/database/ca-certificate.crt")
            .toString(),
        }
      : false,
  migrations: [],
});
