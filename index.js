const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

const dbFilePath = path.resolve(__dirname, 'db.json');
let db = JSON.parse(fs.readFileSync(dbFilePath, 'UTF-8'));

app.use(async (req, res, next) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    next();
});

app.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ message: 'AUTH ERROR' });
    }
    next();
});

app.get('/posts', (req, res) => {
    res.json(db.posts);
});

app.get('/comments', (req, res) => {
    res.json(db.comments);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const { users } = db;
    const userFromBd = users.find(
        (user) => user.username === username && user.password === password
    );

    if (userFromBd) {
        const token = jwt.sign({ id: userFromBd.id }, 'your_secret_key', { expiresIn: '1h' });
        return res.json({ token });
    }

    return res.status(403).json({ message: 'AUTH ERROR' });
});

app.get('/profile', (req, res) => {
    res.json(db.profile);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
