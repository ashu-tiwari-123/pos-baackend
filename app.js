//all imports
import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import connectDB from './db/connect.js';
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

//importing routes
import orderRoute from './routes/orderRoute.js';
import itemRoute from './routes/itemRoute.js';
import customerRoute from './routes/customerRoute.js';
import reportRoute from './routes/reportRoute.js';
import ticketRoute from './routes/ticketRoute.js';
import userRoute from './routes/userRoute.js';
import ingredientRoute from './routes/ingredientRoute.js';
import receiptRoute from './routes/receiptRoute.js';
import tableRoute from './routes/tableRoute.js';

const app = express();
const port = process.env.PORT || 5000;
const swaggerDocument = YAML.load('./newswagger.yaml');

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send(`<h1>Welcome to Restaurant POS API</h1>
    <br><a href="/api-docs">Documentation</a>`);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//using routes
app.use('/order', orderRoute);
app.use('/item', itemRoute);
app.use('/customer', customerRoute);
app.use('/report', reportRoute);
app.use('/table', tableRoute);
app.use('/ticket', ticketRoute);
app.use('/user', userRoute);
app.use('/ingredient', ingredientRoute);
app.use('/receipt', receiptRoute);



//connecting to database
connectDB();

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});