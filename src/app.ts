import router from "./routes";
import { AppDataSource } from "./data-source.ts";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { swaggerSpec } from "./config/swagger.ts";

// Initialize database connection
let isDatabaseReady = false;

const swaggerUiPath = join(__dirname, "../node_modules/swagger-ui-dist");

AppDataSource.initialize()
  .then(() => {
    isDatabaseReady = true;

    // Start server after database is ready
    Bun.serve({
      port: parseInt(process.env.PORT || "8000"),
      async fetch(req: Request) {
        const url = new URL(req.url);

        // Check if database is ready
        if (!isDatabaseReady) {
          return new Response("Service Unavailable - Database initializing", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        }

        // Serve Swagger UI
        if (url.pathname === "/api-docs") {
          let swaggerHtml = readFileSync(
            join(swaggerUiPath, "index.html"),
            "utf-8"
          );
          swaggerHtml = swaggerHtml.replace(
            "https://petstore.swagger.io/v2/swagger.json",
            "/swagger.json"
          );
          return new Response(swaggerHtml, {
            headers: { "Content-Type": "text/html" },
          });
        }

        // Serve OpenAPI specification
        if (url.pathname === "/swagger.json") {
          return new Response(JSON.stringify(swaggerSpec), {
            headers: { "Content-Type": "application/json" },
          });
        }

        const filePath = join(swaggerUiPath, url.pathname);
        if (existsSync(filePath)) {
          const fileContent = readFileSync(filePath);
          return new Response(fileContent, {
            headers: { "Content-Type": getContentType(url.pathname) },
          });
        }

        // Handle API routes

        return router.match(req);
      },
    });

    console.log(
      `Server running on http://localhost:${process.env.PORT || 8000}`
    );
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });

function getContentType(pathname: string): string {
  if (pathname.endsWith(".css")) return "text/css";
  if (pathname.endsWith(".js")) return "application/javascript";
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".json")) return "application/json";
  return "text/plain";
}
