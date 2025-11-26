const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const yahooAuth = require("./auth/yahoo_auth");
const app = express();
const PORT = process.env.PORT || 4300;
const apiRouter = require("./routes/router");
const openapiPath = path.join(__dirname, "openapi.yaml");


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

// routes
app.use("/", yahooAuth);
app.use("/api", apiRouter);

if (app._router && app._router.stack) {
  app._router.stack
    .filter((r) => r.route)
    .forEach((r) => {
      console.log(
        `hello!!!!!! ${Object.keys(r.route.methods)}, ${r.route.path}`
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

app.get("/", (req, res) => {
  if (fs.existsSync(openapiPath)) return res.redirect("/docs");
  return res.json({
    name: "Express Swagger Starter",
    health: "/api/health",
    docs: "/docs",
  });
});
// TROUBLESHOOTING
// ["FMP_API_KEY", "FMP_URL"].forEach((k) =>
//   console.log(`[env] ${k}=${process.env[k] ? `${k.length}` : "(MISSING)"}`)
// );
// const resolved = path.resolve(__dirname, "..", ".env");
// console.log("[dotenv] resolved path:", resolved);

// const result = require("dotenv").config({
//   path: resolved,
//   override: true,
//   debug: true,
// });
// if (result.error) {
//   console.error("[dotenv] ERROR:", result.error);
// } else {
//   console.log(
//     "[dotenv] parsed keys:",
//     result.parsed ? Object.keys(result.parsed) : []
//   );
// }

app.use((req, res) => res.status(404).json({ error: "Not Found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  if (fs.existsSync(openapiPath))
    console.log(`Swagger UI on http://localhost:${PORT}/docs`);
});

module.exports = app;
