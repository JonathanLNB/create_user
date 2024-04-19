import 'dotenv/config'
import {App} from "./application";

const port: number = parseInt(process.env.PORT) || 3000;
const app = new App(port, []);
app.listen();
