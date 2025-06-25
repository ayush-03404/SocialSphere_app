import express from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());

async function startServer() {
  const httpServer = await registerRoutes(app);
  
  const port = process.env.PORT || 3000;
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch(console.error);