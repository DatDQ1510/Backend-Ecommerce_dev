

const app = require('./src/app.js');
const PORT = process.env.PORT || 3000;
// console.log(app._router.stack.filter(r => r.route).map(r => r.route.path));
const listEndpoints = require('express-list-endpoints');
console.log(listEndpoints(app));
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}, check`);
    console.log(PORT);
});

// process.on('SIGHT', () => {
//     server.close(() => {
//         console.log('Server closed');
//     });
// }
// );