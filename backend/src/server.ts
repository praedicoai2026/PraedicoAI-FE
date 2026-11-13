import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectToDatabase, disconnectFromDatabase } from "./db/mongoose.js";

async function startServer() {
  await connectToDatabase();
  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "API server listening");
  });

  let shuttingDown = false;
  const shutdown = (signal: NodeJS.Signals) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "Shutting down API server");

    server.close((error) => {
      if (error) {
        logger.error({ err: error }, "HTTP server shutdown failed");
        process.exitCode = 1;
      }

      void disconnectFromDatabase()
        .then(() => logger.info("Database connection closed"))
        .catch((disconnectError: unknown) => {
          logger.error({ err: disconnectError }, "Database shutdown failed");
          process.exitCode = 1;
        });
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

void startServer().catch((error: unknown) => {
  logger.fatal({ err: error }, "API server failed to start");
  process.exitCode = 1;
});
