const express = require('express');
const uuidv4 = require('uuid').v4
const app = express()

app.use(express.json())

const sessions = {};

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if( username !== 'admin' || password !== 'admin'){
        return res.status(401).send('Invalid username or password');
    }
    const sessionId = uuidv4();
    sessions[sessionId] =  {username, userId : 1};
    res.set('Set-Cookie', `session=${sessionId}`);
    res.send('success')
})


app.post('/logout',(req,res) => {
    const sessionId = req.headers.cookie.split('=')[1];
    delete sessions[sessionId]
    res.set('Set-Cookie', `session=; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    res.send('Successfully logged out')
})

app.get('/todos',(req,res) => {
    const sessionId = req.headers.cookie?.split('=')[1];
    const userSession = sessions[sessionId];
    if(!userSession){
        return res.status(401).send('Invalid Session');
    }
    const userId = userSession.userId;
    res.send([{
        id: 1,
        title: 'Learn Node',
        userId,
    }])
})


app.listen(8000, console.log("Server running successfully"))