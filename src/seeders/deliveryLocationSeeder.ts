import { DeliveryLocation } from "../models/DeliveryLocation";
import { DeliveryPricing } from "../models/DeliveryPricing";
import { AppDataSource } from "../data-source";

export async function seedDeliveryLocationsAndPricing() {
  const locationRepo = AppDataSource.getRepository(DeliveryLocation);
  const pricingRepo = AppDataSource.getRepository(DeliveryPricing);

  // Cyprus locations (expanded)
  const locations = [
    { country: "Cyprus", area: "Lefkosia Center" },
    { country: "Cyprus", area: "Mesa Geitonia" },
    { country: "Cyprus", area: "Limassol Center" },
    { country: "Cyprus", area: "Larnaca Center" },
    { country: "Cyprus", area: "Paphos Center" },
    { country: "Cyprus", area: "Ayia Napa" },
    { country: "Cyprus", area: "Strovolos" },
    { country: "Cyprus", area: "Engomi" },
    { country: "Cyprus", area: "Aglandjia" },
    { country: "Cyprus", area: "Kaimakli" },
    { country: "Cyprus", area: "Germasogeia" },
    { country: "Cyprus", area: "Aradippou" },
    { country: "Cyprus", area: "Dali" },
    { country: "Cyprus", area: "Paralimni" },
    { country: "Cyprus", area: "Polis Chrysochous" },
    { country: "Cyprus", area: "Protaras" },
    { country: "Cyprus", area: "Lakatamia" },
    { country: "Cyprus", area: "Latsia" },
    { country: "Cyprus", area: "Oroklini" },
    { country: "Cyprus", area: "Pera Chorio" },
  ];

  // Insert locations and build a map for lookup
  const savedLocations = await locationRepo.save(
    locations.map((l) => locationRepo.create({ ...l, status: "active" }))
  );
  // Map: area name -> location entity and id
  const locationMap = Object.fromEntries(
    savedLocations.map((l) => [l.area, l])
  );

  // Pricing between locations (example prices, using area names)
  const pricingData = [
    { origin: "Lefkosia Center", dest: "Mesa Geitonia", price: 5.0 },
    { origin: "Mesa Geitonia", dest: "Lefkosia Center", price: 5.0 },
    { origin: "Lefkosia Center", dest: "Limassol Center", price: 7.5 },
    { origin: "Limassol Center", dest: "Lefkosia Center", price: 7.5 },
    { origin: "Lefkosia Center", dest: "Larnaca Center", price: 6.0 },
    { origin: "Larnaca Center", dest: "Lefkosia Center", price: 6.0 },
    { origin: "Lefkosia Center", dest: "Paphos Center", price: 10.0 },
    { origin: "Paphos Center", dest: "Lefkosia Center", price: 10.0 },
    { origin: "Lefkosia Center", dest: "Ayia Napa", price: 8.0 },
    { origin: "Ayia Napa", dest: "Lefkosia Center", price: 8.0 },
    { origin: "Lefkosia Center", dest: "Strovolos", price: 2.5 },
    { origin: "Strovolos", dest: "Lefkosia Center", price: 2.5 },
    { origin: "Lefkosia Center", dest: "Engomi", price: 2.0 },
    { origin: "Engomi", dest: "Lefkosia Center", price: 2.0 },
    { origin: "Lefkosia Center", dest: "Aglandjia", price: 2.2 },
    { origin: "Aglandjia", dest: "Lefkosia Center", price: 2.2 },
    { origin: "Limassol Center", dest: "Mesa Geitonia", price: 3.0 },
    { origin: "Mesa Geitonia", dest: "Limassol Center", price: 3.0 },
    { origin: "Limassol Center", dest: "Germasogeia", price: 2.8 },
    { origin: "Germasogeia", dest: "Limassol Center", price: 2.8 },
    { origin: "Larnaca Center", dest: "Aradippou", price: 2.5 },
    { origin: "Aradippou", dest: "Larnaca Center", price: 2.5 },
    { origin: "Lefkosia Center", dest: "Dali", price: 4.0 },
    { origin: "Dali", dest: "Lefkosia Center", price: 4.0 },
    { origin: "Ayia Napa", dest: "Protaras", price: 3.5 },
    { origin: "Protaras", dest: "Ayia Napa", price: 3.5 },
    { origin: "Lefkosia Center", dest: "Lakatamia", price: 2.3 },
    { origin: "Lakatamia", dest: "Lefkosia Center", price: 2.3 },
    { origin: "Lefkosia Center", dest: "Latsia", price: 2.4 },
    { origin: "Latsia", dest: "Lefkosia Center", price: 2.4 },
    { origin: "Larnaca Center", dest: "Oroklini", price: 2.6 },
    { origin: "Oroklini", dest: "Larnaca Center", price: 2.6 },
    { origin: "Lefkosia Center", dest: "Pera Chorio", price: 3.8 },
    { origin: "Pera Chorio", dest: "Lefkosia Center", price: 3.8 },
    // ...add more as needed
  ];

  await pricingRepo.save(
    pricingData
      .filter((p) => locationMap[p.origin] && locationMap[p.dest])
      .map((p) =>
        pricingRepo.create({
          originLocation: { id: locationMap[p.origin].id },
          destinationLocation: { id: locationMap[p.dest].id },
          price: p.price,
          status: "active",
        })
      )
  );

  console.log("Seeded delivery locations and pricing.");
}
