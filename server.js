

const app = require('./src/app.js');
const PORT = process.env.PORT



const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}, check`);

});

// process.on('SIGHT', () => {
//     server.close(() => {
//         console.log('Server closed');
//     });
// }
// );