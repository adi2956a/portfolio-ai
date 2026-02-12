import app from "./app.js";
import { connectDb } from "./config/db.js";

const port = process.env.PORT || 5000;

const start = async () => {
  await connectDb();
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
