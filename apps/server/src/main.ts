import * as http from 'node:http';

import app from './app';

const port = Number(process?.env?.PORT || 3010);

const init = async (): Promise<void> => {
  const server = http.createServer(app);

  server.listen(port, '::', () => {
    console.log(`API http server running on port ${port}`);
  });
};

init();
