import express from "express";
import cors from "cors"
import { body, validationResult } from "express-validator";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json())

const users = [];
const tweets = [];

app.post("/sign-up", [ 
    body("username").isLength({min: 2}).withMessage("O nome precisa ter mais que 2 caracteres!"),
    body("avatar").isURL().withMessage("Precisa ser uma URL válida!"),
], (request, response) => {

    const body = request.body;
    const errors = validationResult(request);

    if(!errors.isEmpty()){
        return response.status(400).json( {msg: "Todos os campos são obrigatórios!"} );
    }

    if (body.username.length >= 2 && isValidHttpUrl(body.avatar)) {
        users.push({
            username: body.username,
            avatar: body.avatar
        })
        response.send("OK");
    }
    response.send("Invalid data"); 
})

app.get("/tweets", (request, response) => {
    
    response.send(tweets.slice(-10));
})

app.post("/tweets", [ 
    body("username").isLength({min: 2}).withMessage("O nome precisa ter mais que 2 caracteres!"),
    body("tweet").isLength({min: 1}).withMessage("O tweet precisa ter no mínimo 1 caracter!"),
], (request, response) => {

    const body = request.body;
    const user = users.find( user => user.username === body.username);
    const errors = validationResult(request);

    if(!errors.isEmpty()){
        return response.status(400).json( {msg: "Todos os campos são obrigatórios!"} );
    }

    tweets.push({
        username: user.username,
        avatar: user.avatar,
        tweet: body.tweet
    })

    response.send("OK");
})

app.listen(5000);

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:"
}