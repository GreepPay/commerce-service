import { fullProductValidationSchema } from "./productValidation";
import type { BunRequest } from "../../routes/router";

export async function validateProductInput(req: BunRequest) {
  const data = await req.validate(fullProductValidationSchema);

  // Dynamic type-based required checks
  switch (data.type) {
    case "event":
      if (!data.eventDetails) {
        throw new Error("eventDetails is required for event products.");
      }
      break;
    case "physical":
      if (!data.physicalDetails) {
        throw new Error("physicalDetails is required for physical products.");
      }
      break;
    case "digital":
      if (!data.digitalDetails) {
        throw new Error("digitalDetails is required for digital products.");
      }
      break;
    case "subscription":
      if (!data.subscriptionDetails) {
        throw new Error("subscriptionDetails is required for subscription products.");
      }
      break;
  }

  return data;
}