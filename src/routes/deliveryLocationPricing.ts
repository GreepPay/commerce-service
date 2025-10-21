import { DeliveryPricingController } from "../controllers/DeliveryLocationController";
import router, { type BunRequest } from "./router";

const APP_VERSION = "v1";
const pricingController = new DeliveryPricingController();

router.add(
  "POST",
  `/${APP_VERSION}/delivery-pricing`,
  async (request: BunRequest) => {
    const result = await pricingController.create(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);

router.add(
  "PUT",
  `/${APP_VERSION}/delivery-pricing/:id`,
  async (request: BunRequest) => {
    const result = await pricingController.update(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);

router.add(
  "DELETE",
  `/${APP_VERSION}/delivery-pricing/:id`,
  async (request: BunRequest) => {
    const result = await pricingController.delete(request);
    return new Response(JSON.stringify(result.body), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  }
);

export {};