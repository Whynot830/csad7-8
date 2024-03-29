const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { pool } = require('./db/db.js')
const generalRouter = require('./routes/general.js')
const authRouter = require('./routes/auth.js')
const productRouter = require('./routes/product.js')
const errorMiddleware = require('./middleware/error.js')

const app = express();
app.use(cors(
    {
        origin: ['http://localhost:5173'],
        credentials: true
    }))
    .use(express.json())
    .use(cookieParser())
    .use('/', generalRouter)
    .use('/api/auth', authRouter)
    .use('/api/products', productRouter)
    .use(errorMiddleware)
    .listen(3000, () => {
        console.log('Server is listening on port 3000')
    })

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    // pool.query("CREATE TABLE IF NOT EXISTS products(id SERIAL PRIMARY KEY, " +
    //     "name VARCHAR(255) NOT NULL, description TEXT NOT NULL, " +
    //     "created TIMESTAMPTZ DEFAULT NOW())", () => {
    //         pool.query("INSERT INTO products(name, description) values " +
    //             "('Test Product', 'Test Description')")
    //     })
})
