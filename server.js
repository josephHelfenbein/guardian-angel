const httpsLocalhost = require('https-localhost')();
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  httpsLocalhost.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });

  httpsLocalhost.all('*', (req, res) => {
    return handle(req, res);
  });
});
