

const app = require('./src/app.js');
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}, check`);
    console.log(process.env.PORT);
});

// process.on('SIGHT', () => {
//     server.close(() => {
//         console.log('Server closed');
//     });
// }
// );