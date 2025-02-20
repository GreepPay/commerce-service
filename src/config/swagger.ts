import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Greep Auth API",
      version: "1.0.0",
      description: "API documentation for Greep Auth backend",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to your route files
};

export const swaggerSpec = swaggerJsdoc(options);
