const express = require('express');
const app = express();
const conn = require('./config/conn');
const http = require('http');
const routes = require('./config/routes');
const socket = require('socket.io');
const models = require('./config/models');
const plugins = require('./config/plugins');

const server = http.createServer(app);
const io = socket(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

require("dotenv").config();
// Parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/*', (req, res, next) => {
    if (req.body) req.body.isDeleted = { $ne: true };

    next();
});

// Test
app.get('/ping', (req, res) => {
    res.send('TEST');
});

// Cors
const cors = require('cors');
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));

// MongoDB Conn
const mongoose = require('mongoose');
mongoose.connect(conn.database.path, { useNewUrlParser: true })
.then(() => {
    console.log('Mongoose OK');
})
.catch(err => console.log('mongoose err', err));

// Mongoose on / once
mongoose.connection.on('error', (err) => {
    console.log('Mongoose Connection Err', err);
});
mongoose.connection.once('open', () => {
    console.log('MongoDB Connected');
});

// Router
app.use('/api', routes);

// PORT
const PORT = process.env.REACT_APP_PORT || 4001;
server.listen(PORT, () => {
    const message = `
        [ Advice Project ]
        Running PORT: localhost:${PORT}
    `;

    console.log(message);
});



io.on('connection', async (socket) => {
    await socket.on('message', ({name, message}) => {
        console.log(name);
        console.log(message);
        const chat = new models.Chat({
            _id: new plugins.mongoose.Types.ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date(),
    
            name: name,
            message: message
        });

        chat.save()
        .then(result => {
            io.emit('message', ({name: result.name, message: result.message}));
        })
        .catch(err => console.log('chat err', err));

    });
    console.log('연결 완료');
});