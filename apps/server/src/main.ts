import * as http from 'node:http';

import app from './app';

const port = Number(process.env.PORT ?? 3010);

const init = (): void => {
  const server = http.createServer(app);

  server.listen(port, '::', () => {
    console.log(`API http server running on port ${port}`);
  });

  const shutdown = (signal: string): void => {
    console.log(`${signal} received, shutting down gracefully`);
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

init();
