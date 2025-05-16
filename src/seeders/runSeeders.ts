import { AppDataSource } from "../data-source";
import { seedProducts } from "./productSeeder";

AppDataSource.initialize()
  .then(async () => {
    console.log("🌱 Seeding started...");
    await seedProducts();
    console.log("🌿 All done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });