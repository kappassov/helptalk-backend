import * as bodyParser from "body-parser";
import express = require('express');
import 'dotenv/config'
import { connect } from "./db.connect";

class App {

    public express: express.Application;
    private db: any = {};

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.db = connect();
        // For Development
        this.db.sequelize.sync({ force: true }).then(() => {
            console.log("Drop and re-sync db.");
        });
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {

        this.express.get('/api', (req, res) => {
            console.log("called /api")
        });

        // handle undefined routes
        this.express.use("*", (req, res, next) => {
            res.send("Make sure url is correct!!!");
        });
    }
}

export default new App().express;