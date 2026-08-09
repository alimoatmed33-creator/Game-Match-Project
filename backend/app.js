const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const gameRoutes = require("./routes/gameRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/games", gameRoutes);

// Serve frontend built static files
const frontendDist = path.join(__dirname, "../frontend/dist/frontend/browser");
app.use(express.static(frontendDist, { index: ["index.html", "index.csr.html"] }));

// SPA fallback
app.use((req, res) => {
  const indexPath = path.join(frontendDist, "index.html");
  const indexCsrPath = path.join(frontendDist, "index.csr.html");

  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  } else if (fs.existsSync(indexCsrPath)) {
    return res.sendFile(indexCsrPath);
  } else {
    return res.status(404).send("Frontend assets not built yet.");
  }
});

module.exports = app;
