import config from 'dotenv';
import express from 'express';
const cors = require('cors');
import bodyParser from 'body-parser';
import userRoutes from '../api/server/routes/UserRoutes';

config.config();

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

app.use('/api/v1/users',userRoutes);

// when a random route is inputed
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to this API.'
}));

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});

export default app;