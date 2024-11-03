import { setupServer } from 'msw/node';
import { handlers } from './serverHandlers';

const server = setupServer(...handlers);

function checkServerReady(maxAttempts = 10, intervalTime = 1000) {
  return new Promise<void>((resolve, reject) => {
    let attempts = 0;

    const interval = setInterval(() => {
      attempts++;

      // Assume you have an endpoint to check the server
      fetch('/api/tickets')
        .then(response => {
          if (response.ok) {
            clearInterval(interval);
            resolve(); // Server is ready
          }
        })
        .catch(() => {
          // Server is not ready or there is an error, continue trying
        });

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        reject(new Error('Server was not ready in time'));
      }
    }, intervalTime);
  });
}

async function startServer() {
  try {
    server.listen();
    await checkServerReady();
  } catch (error) {
    console.error('Server MSW FAIL', error);
  }
}

export { server, startServer };
