type Handler = (req: BunRequest) => Response | Promise<Response>;

interface Route {
  method: string;
  path: string;
  handler: Handler;
  validation?: Validation[];
}

export interface BunRequest extends Request {
  params: Record<string, string>;
  query: URLSearchParams;
  body: any;
  validate: (validations?: Validation[]) => Promise<any>;
}

export interface Validation {
  field: string;
  type: string; // e.g.,  'string', 'number', 'boolean', 'array', 'object'
  required?: boolean;
  children?: Validation[];
  allowed?: any[];
}

class ValidationError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.name = "ValidationError";
    this.status = status;
  }
}

class Router {
  private routes: Route[] = [];

  // Register a new route
  add(method: string, path: string, handler: Handler, validation?: Validation[]) {
    this.routes.push({
      method: method.toUpperCase(),
      path,
      handler,
      validation,
    });
  }

  // Match incoming request with registered routes
  async match(req: Request) {
    const url = new URL(req.url);
    const method = req.method.toUpperCase();
    const pathParts = url.pathname.split("/").filter(Boolean);

    for (const route of this.routes) {
      const routeParts = route.path.split("/").filter(Boolean);

      if (route.method !== method || routeParts.length !== pathParts.length) {
        continue;
      }

      const params: Record<string, string> = {};
      let match = true;

      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(":")) {
          params[routeParts[i].slice(1)] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        // Extend the Request object with `params` and `query`
        const extendedRequest: BunRequest = Object.assign(req, {
          params,
          query: url.searchParams,
          validate: async (validations?: Validation[]) => {
            if (!validations || validations.length === 0) {
              return null;
            }

            const jsonContent: any = await extendedRequest.json();

            const data = {
              ...extendedRequest.params,
              ...Object.fromEntries(extendedRequest.query.entries()),
              ...jsonContent,
            };

            for (const validation of validations) {
              const value = data[validation.field];

              if (validation.required && (value === undefined || value === null)) {
                throw new ValidationError(`Field '${validation.field}' is required.`);
              }

              if (value !== undefined && value !== null) {
                if (validation.type === "string" && typeof value !== "string") {
                  throw new ValidationError(`Field '${validation.field}' must be a string.`);
                }
                if (validation.type === "number" && typeof value !== "number") {
                  throw new ValidationError(`Field '${validation.field}' must be a number.`);
                }
                if (validation.type === "boolean" && typeof value !== "boolean") {
                  throw new ValidationError(`Field '${validation.field}' must be a boolean.`);
                }
                if (validation.type === "array" && !Array.isArray(value)) {
                  throw new ValidationError(`Field '${validation.field}' must be an array.`);
                }
                if (validation.type === "object" && typeof value !== "object") {
                  throw new ValidationError(`Field '${validation.field}' must be an object.`);
                }

                if (validation.allowed && !validation.allowed.includes(value)) {
                  throw new ValidationError(
                    `Field '${validation.field}' must be one of: ${validation.allowed.join(", ")}`
                  );
                }

                if (validation.type === "array" && validation.children) {
                  for (let i = 0; i < value.length; i++) {
                    const item = value[i];

                    for (const child of validation.children) {
                      const isPrimitive = child.field === "" || child.field === undefined;

                      if (isPrimitive) {
                        if (typeof item !== child.type) {
                          throw new ValidationError(
                            `Field '${validation.field}[${i}]' must be a ${child.type}.`
                          );
                        }
                      } else {
                        const itemVal = item?.[child.field];
                        if (child.required && (itemVal === undefined || itemVal === null)) {
                          throw new ValidationError(
                            `Field '${validation.field}[${i}].${child.field}' is required.`
                          );
                        }

                        if (itemVal !== undefined && itemVal !== null && typeof itemVal !== child.type) {
                          throw new ValidationError(
                            `Field '${validation.field}[${i}].${child.field}' must be a ${child.type}.`
                          );
                        }
                      }
                    }
                  }
                }

                if (validation.type === "object" && validation.children) {
                  for (const child of validation.children) {
                    const childValue = value[child.field];
                    if (child.required && (childValue === undefined || childValue === null)) {
                      throw new ValidationError(`Field '${validation.field}.${child.field}' is required.`);
                    }
                    if (childValue !== undefined && childValue !== null && typeof childValue !== child.type) {
                      throw new ValidationError(`Field '${validation.field}.${child.field}' must be a ${child.type}.`);
                    }
                  }
                }
              }
            }

            return data;
          },
        });

        return route.handler(extendedRequest);
      }
    }

    return new Response("Not Found", { status: 404 });
  }
}

// Initialize Router
const router = new Router();

export default router;