const app = require('./src/app');
const config = require('./src/config');

app.listen(config.port, () => console.log(`API escuchando en http://localhost:${config.port}`));
