const express = require('express');
const app = express();
const port = 3000
const pool = require("./pool")
const { check, validationResult } = require('express-validator')

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(__dirname + '/public/'))



app.get('/login/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html')
});

app.get('/login/users', async (req, res) => {
  const getUsers = await pool.query("SELECT * FROM userinfo")
    .then(data => {
      res.send(data.rows)
    })
});


//Validation and Sanitation of form data.
const loginValidation = [
  check('username', 'Username must be an email address').isEmail().trim().escape().normalizeEmail(),
  check('password').isLength({ min: 8 }).withMessage('Password must be 8 characters long')
    .matches('[0-9]').withMessage('Password must contain a number')
    .matches('[A-Z]').withMessage('Password must contain an uppercase letter')
    .trim().escape()
]


app.post('/login', loginValidation, async (req, res) => {
  const { username, password } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    const postUser = await pool.query("INSERT INTO userinfo (username, password) VALUES ($1, $2)", [username, password])
      .then(data => {
        res.send(`
    Created: 
    Username: ${username}
    Password: ${password}`)
      })
      .catch(err => console.error(err))
  }
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})