import { DeliveryLocationController } from "../controllers/DeliveryLocationController";
import router, { type BunRequest } from "./router";

const APP_VERSION = "v1";
const locationController = new DeliveryLocationController();

router.add(
  "POST",
  `/${APP_VERSION}/delivery-locations`,
  async (request: BunRequest) => {
    const result = await locationController.create(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);

router.add(
  "PUT",
  `/${APP_VERSION}/delivery-locations/:id`,
  async (request: BunRequest) => {
    const result = await locationController.update(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);

router.add(
  "DELETE",
  `/${APP_VERSION}/delivery-locations/:id`,
  async (request: BunRequest) => {
    const result = await locationController.delete(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);

export {};