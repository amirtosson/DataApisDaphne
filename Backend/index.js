const express = require('express'); 
const cors = require('cors');
const app = express(); 
const bodyparser = require('body-parser');

// Define the CORS 
app.use(cors({
    origin: true,
    credentials: true, 
    methods: 'POST,GET,PUT,OPTIONS,DELETE' 
}));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: false
  }));
// Importing routers 
const userRouter = require('./routers/user.routers');
const datasetsRouter = require('./routers/datasets.routers');
const projectsRouter = require('./routers/projects.routers');
const generalRouter = require('./routers/general.routers');


app.use(userRouter);
app.use(projectsRouter);
app.use(generalRouter);
app.use(datasetsRouter);

app.listen(3050, () => console.log(`Dataseets APIs listening on port 3050!`));