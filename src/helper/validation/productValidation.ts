import type { Validation } from "../../routes/router";

// Enhanced Validation type to support dynamic validation
interface DynamicValidation extends Validation {
  validator?: (data: any, fieldValue: any) => boolean | string;
  conditional?: (data: any) => boolean;
}

export function getDynamicProductSchema(): DynamicValidation[] {
  return [
    // Base validations
    { field: "name", type: "string", required: true },
    { field: "description", type: "string", required: true },
    { field: "type", type: "string", required: true },
    { field: "price", type: "number", required: true },
    { field: "status", type: "string", required: false },
    { field: "currency", type: "string", required: true },
    { field: "categoryIds", type: "array", required: false },
    { field: "tags", type: "array", required: false },

    // Physical product fields (conditional on type)
    {
      field: "inventoryCount",
      type: "number",
      required: false,
      conditional: (data) => data.type === "physical",
      validator: (data, value) => {
        if (data.type === "physical" && (value === undefined || value === null)) {
          return "inventoryCount is required for physical products";
        }
        return true;
      }
    },
    {
      field: "weight",
      type: "number",
      required: false,
      conditional: (data) => data.type === "physical",
      validator: (data, value) => {
        if (data.type === "physical" && (value === undefined || value === null)) {
          return "weight is required for physical products";
        }
        return true;
      }
    },
    {
      field: "dimensions",
      type: "object",
      required: false,
      conditional: (data) => data.type === "physical",
      validator: (data, value) => {
        if (data.type === "physical") {
          if (!value) return "dimensions is required for physical products";
          if (!value.length || !value.width || !value.height) {
            return "dimensions must include length, width, and height";
          }
          if (typeof value.length !== "number" || typeof value.width !== "number" || typeof value.height !== "number") {
            return "dimensions length, width, and height must be numbers";
          }
        }
        return true;
      }
    },

    // Digital product fields
    {
      field: "downloadUrl",
      type: "string",
      required: false,
      conditional: (data) => data.type === "digital",
      validator: (data, value) => {
        if (data.type === "digital" && !value) {
          return "downloadUrl is required for digital products";
        }
        return true;
      }
    },
    {
      field: "downloadLimit",
      type: "number",
      required: false,
      conditional: (data) => data.type === "digital"
    },

    // Subscription product fields
    {
      field: "billingInterval",
      type: "string",
      required: false,
      conditional: (data) => data.type === "subscription",
      validator: (data, value) => {
        if (data.type === "subscription" && !value) {
          return "billingInterval is required for subscription products";
        }
        return true;
      }
    },
    {
      field: "trialPeriodDays",
      type: "number",
      required: false,
      conditional: (data) => data.type === "subscription"
    },

    // Event product fields
    {
      field: "eventType",
      type: "string",
      required: false,
      conditional: (data) => data.type === "event",
      validator: (data, value) => {
        if (data.type === "event") {
          if (!value) return "eventType is required for event products";
          if (!["online", "offline", "hybrid"].includes(value)) {
            return "eventType must be 'online', 'offline', or 'hybrid'";
          }
        }
        return true;
      }
    },
    {
      field: "eventDetails",
      type: "object",
      required: false,
      conditional: (data) => data.type === "event",
      validator: (data, value) => {
        if (data.type === "event") {
          if (!value) return "eventDetails is required for event products";
          
          // Validate required event details fields
          const requiredFields = ["startDate", "endDate", "registeredCount", "waitlistEnabled"];
          for (const field of requiredFields) {
            if (value[field] === undefined || value[field] === null) {
              return `eventDetails.${field} is required`;
            }
          }

          // Validate field types
          if (typeof value.startDate !== "string") return "eventDetails.startDate must be a string";
          if (typeof value.endDate !== "string") return "eventDetails.endDate must be a string";
          if (typeof value.registeredCount !== "number") return "eventDetails.registeredCount must be a number";
          if (typeof value.waitlistEnabled !== "boolean") return "eventDetails.waitlistEnabled must be a boolean";

          // Validate optional fields if present
          if (value.venueName && typeof value.venueName !== "string") {
            return "eventDetails.venueName must be a string";
          }
          if (value.onlineUrl && typeof value.onlineUrl !== "string") {
            return "eventDetails.onlineUrl must be a string";
          }
          if (value.capacity && typeof value.capacity !== "number") {
            return "eventDetails.capacity must be a number";
          }

          // Validate location if present
          if (value.location) {
            const location = value.location;
            const locationRequiredFields = ["address", "city", "country"];
            for (const field of locationRequiredFields) {
              if (!location[field]) {
                return `eventDetails.location.${field} is required when location is provided`;
              }
            }

            // Validate coordinates if present
            if (location.coordinates) {
              if (typeof location.coordinates.lat !== "number" || typeof location.coordinates.lng !== "number") {
                return "eventDetails.location.coordinates must include lat and lng as numbers";
              }
            }
          }
        }
        return true;
      }
    }
  ];
}

// Helper function to validate data against dynamic schema
export function validateDynamicSchema(schema: DynamicValidation[], data: any): { isValid: boolean; errors: string[]; validatedData: any } {
  const errors: string[] = [];
  const validatedData = { ...data };

  for (const validation of schema) {
    const fieldValue = data[validation.field];

    // Check if field should be validated based on conditions
    if (validation.conditional && !validation.conditional(data)) {
      continue;
    }

    // Check required fields
    if (validation.required && (fieldValue === undefined || fieldValue === null || fieldValue === "")) {
      errors.push(`${validation.field} is required`);
      continue;
    }

    // Skip validation if field is not present and not required
    if (!validation.required && (fieldValue === undefined || fieldValue === null)) {
      continue;
    }

    // Type validation
    if (fieldValue !== undefined && fieldValue !== null) {
      const typeValid = validateFieldType(fieldValue, validation.type);
      if (!typeValid) {
        errors.push(`${validation.field} must be of type ${validation.type}`);
        continue;
      }
    }

    // Custom validation
    if (validation.validator) {
      const validationResult = validation.validator(data, fieldValue);
      if (validationResult !== true) {
        errors.push(typeof validationResult === "string" ? validationResult : `${validation.field} is invalid`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    validatedData
  };
}

// Helper function to validate field types
function validateFieldType(value: any, type: string): boolean {
  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && !isNaN(value);
    case "boolean":
      return typeof value === "boolean";
    case "array":
      return Array.isArray(value);
    case "object":
      return typeof value === "object" && value !== null && !Array.isArray(value);
    default:
      return true;
  }
}