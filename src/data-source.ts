import { DataSource } from "typeorm";
import { Product } from "./models/Product";
import { Order } from "./models/Order";
import { Delivery } from "./models/Delivery";
import { Sale } from "./models/Sale";
import { Customer } from "./models/Customer";
import { Category } from "./models/Category";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [Delivery, Order, Product, Category, Sale, Customer],
  // entities: ["src/models/**/*.ts"],
  subscribers: [],
  // migrations: ["src/database/migrations/*.ts"],
});
