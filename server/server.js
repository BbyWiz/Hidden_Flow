// server/server.js
const path = require("path");
const fs = require("fs");

// Load .env file if it exists (local development)
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
} else {
  // In production (Docker/Azure), environment variables come from the container/app settings
  require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const yahooAuth = require("./auth/yahoo_auth");
const app = express();
const PORT = process.env.PORT || 3000;

// Startup phase - log immediately
console.log("[STARTUP] Server initializing...");
console.log(`[STARTUP] PORT env var: ${process.env.PORT}`);
console.log(`[STARTUP] Final PORT: ${PORT}`);
console.log(`[STARTUP] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[STARTUP] Node version: ${process.version}`);

// Load router with error handling
let apiRouter;
try {
  apiRouter = require("./routes/router");
  console.log("[STARTUP] Router loaded successfully");
} catch (err) {
  console.error("[STARTUP] FAILED to load router:", err.message);
  process.exit(1);
}

const openapiPath = path.join(__dirname, "openapi.yaml");

console.log("[STARTUP] Express app created successfully");

app.use(express.json());
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

app.use(
  session({
    secret: "dev",
    resave: false,
    saveUninitialized: true,
  })
);

// Simple startup health check (zero dependencies)
app.get("/ping", (req, res) => {
  res.status(200).json({ status: "pong", timestamp: new Date().toISOString() });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// routes
app.use("/", yahooAuth);
app.use("/api", apiRouter);

// Log registered routes in development
if (process.env.NODE_ENV !== "production" && app._router && app._router.stack) {
  app._router.stack
    .filter((r) => r.route)
    .forEach((r) => {
      console.log(
        `[ROUTE] ${Object.keys(r.route.methods).join(",")} ${r.route.path}`
      );
    });
}

// Swagger UI
if (fs.existsSync(openapiPath)) {
  const swaggerUi = require("swagger-ui-express");
  const YAML = require("yamljs");
  const swaggerDocument = YAML.load(openapiPath);
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true })
  );
}

// Angular static + SPA routes (Docker-friendly, supports both dist/ and dist/client/)
const clientDistRoot = path.join(__dirname, "..", "client", "dist");
let clientDistPath = clientDistRoot;

if (fs.existsSync(path.join(clientDistRoot, "client", "index.html"))) {
  clientDistPath = path.join(clientDistRoot, "client");
} else if (fs.existsSync(path.join(clientDistRoot, "index.html"))) {
  clientDistPath = clientDistRoot;
}

if (fs.existsSync(path.join(clientDistPath, "index.html"))) {
  // Serve static files first
  app.use(express.static(clientDistPath));

  // SPA routes: redirect to index.html for Angular routing
  const spaRoutes = ["/login", "/dashboard", "/documentation", "/docs-client"];
  app.get(spaRoutes, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });

  // Catch-all for SPA: any other route that's not /api or /docs, serve index.html
  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/docs")) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.get("/", (req, res) => {
  if (fs.existsSync(openapiPath)) return res.redirect("/docs");
  return res.json({
    name: "Express Swagger Starter",
    health: "/api/health",
    docs: "/docs",
  });
});

app.use((err, req, res, next) => {
  console.error("[ERROR] Unhandled error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error", type: err.constructor.name });
});

// Catch-all 404
app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.path}`);
  res.status(404).json({ error: "Not Found" });
});

// Delayed startup - allow all modules to fully initialize
const startServer = () => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[STARTUP] ✓ API listening on 0.0.0.0:${PORT}`);
    console.log(`[STARTUP] ✓ Environment: NODE_ENV=${process.env.NODE_ENV || "development"}`);
    console.log(`[STARTUP] ✓ Client dist path: ${fs.existsSync(path.join(__dirname, "..", "client", "dist")) ? "Found" : "NOT FOUND"}`);
    if (fs.existsSync(openapiPath))
      console.log(`[STARTUP] ✓ Swagger UI on http://localhost:${PORT}/docs`);
    console.log("[STARTUP] ✓✓✓ SERVER READY ✓✓✓");
  });
};

// Start immediately (don't wait)
process.nextTick(startServer);

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("[FATAL] Unhandled rejection:", reason);
});

module.exports = app;
