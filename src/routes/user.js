import bcrypt from "bcrypt";
import express from "express";
import { v4 as uuidv4 } from "uuid";

import errors from "../const/errors.js";
import { getDbInstance } from "../config/database.js";
import { validateUser } from "../schemas/user.js";

const router = express.Router();

router.all("/sign-in", async (req, res) => {
    if (req.method !== "POST") return res.status(errors[405].code).send(errors[405]);
    if (req.headers["content-type"] !== "application/json") return res.status(errors[415].code).send(errors[415]);
    let { email, password } = req.body;
    const user = await getDbInstance().collection("users").findOne({email});
    if (!user) return res.status(errors["400.1"].code).send(errors["400.1"]);
    try {
        if (await bcrypt.compare(password, user.password)) {
            const auth = {
                token: uuidv4(),
                userId: user._id,
            };
            await getDbInstance().collection("usersAuth").deleteMany({userId: user._id});
            await getDbInstance().collection("usersAuth").insertOne(auth);
            return res.status(200).send({code: 200, message: "user logged in successfully", token: auth.token});
        }
        return res.status(errors["400.1"].code).send(errors["400.1"]);
    } catch (_) {
        return res.status(errors["400.1"].code).send(errors["400.1"]);
    }
});

router.all("/sign-up", async (req, res) => {
    if (req.method !== "POST") return res.status(errors[405].code).send(errors[405]);
    if (req.headers["content-type"] !== "application/json") return res.status(errors[415].code).send(errors[415]);
    const { name, email, password, passwordConfirmation } = req.body;
    if (password !== passwordConfirmation) return res.status(errors["400.2"].code).send(errors["400.2"]);
    const salt = 12;
    const user = {
        name,
        email,
        password: await bcrypt.hash(password, salt),
        created: new Date(),
    };
    const userValidation = await validateUser(user);
    if (userValidation.status !== "ok") {
        errors["400.3"].message = userValidation.message;
        return res.status(errors["400.3"].code).send(errors["400.3"]);
    }
    const userExists = await getDbInstance().collection("users").findOne({email});
    if (userExists) return res.status(errors[409].code).send(errors[409]);
    await getDbInstance().collection("users").insertOne(user);
    return res.status(201).send({code: 201, message: "user created successfully"});
});

export default router;