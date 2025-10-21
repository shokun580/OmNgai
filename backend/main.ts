import "dotenv/config";
import express, {type Express, type Request, type Response} from "express"

import defaultRouter from "./src/routes/default";
// import titleRouter from "./src/routes/titles";
import userRouter from "./src/routes/transection";


const app:Express = express();
const post = process.env.POST || 3000;

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(defaultRouter)
// app.use(titleRouter)
app.use(userRouter)


app.listen(post, ()=> {
    console.log(`Server is running on post ${post}`)
})