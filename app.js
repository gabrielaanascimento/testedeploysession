import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import session from 'express-session'
import { fileURLToPath } from 'url'

const app = express()
const PORT = 3000

app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: 'dnasibcascbscsincmsaj7482427',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'public')))

const USER = {
    user: 'admin',
    password: '1234'
}

app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'))
})

app.get('/entrar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.post('/login', (req,res) => {
    const { username, password } = req.body
    if (username === USER.user && password === USER.password) {
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect('/dashboard');
      } else {
        res.send('<h3>Login inválido</h3><a href="/login">Voltar</a>');
      }
})

app.get('/dashboard', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'dashboard.html'))
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/users/all', async (req, res) => {
    const response = await fetch('https://gerenciaruserapi.vercel.app/');
    const data = await response.json();
    res.status(200).json(data);
});


app.listen(3000)
