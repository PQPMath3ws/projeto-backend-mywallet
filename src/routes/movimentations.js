import express from "express";
import { ObjectId } from "mongodb";
import { stripHtml } from "string-strip-html";

import errors from "../const/errors.js";
import { validateMovimentation } from "../schemas/movimentations.js";
import verifyUserIsLoggedIn from "../middlewares/movimentations.js";
import { getDbInstance } from "../config/database.js";

const router = express.Router();

router.all("/movimentations", verifyUserIsLoggedIn, async (req, res) => {
    if (req.method !== "GET") return res.status(errors[405].code).send(errors[405]);
    const userMovimentations = await getDbInstance().collection("movimentations").find({userId: req.user._id}).toArray();
    return res.status(200).send(userMovimentations);
});

router.all("/movimentations/add", verifyUserIsLoggedIn, async (req, res) => {
    if (req.method !== "POST") return res.status(errors[405].code).send(errors[405]);
    const { value, description, isEntry } = req.body;
    const movimentation = {
        value: typeof value !== "number" ? value : Number(Number(value).toFixed(2)),
        description: stripHtml(description).result,
        isEntry,
        userId: req.user._id,
        created: new Date(),
    };
    const movimentationValidation = await validateMovimentation(movimentation);
    if (movimentationValidation.status !== "ok") {
        errors["400.3"].message = movimentationValidation.message;
        return res.status(errors["400.3"].code).send(errors["400.3"]);
    }
    await getDbInstance().collection("movimentations").insertOne(movimentation);
    return res.status(201).send({code: 201, message: "movimentation added successfully"});
});

router.all("/movimentations/edit/:id", verifyUserIsLoggedIn, async(req, res) => {
    if (req.method !== "PATCH") return res.status(errors[405].code).send(errors[405]);
    const { id } = req.params;
    try {
        const userMovimentationById = await getDbInstance().collection("movimentations").findOne({userId: req.user._id, _id: ObjectId(id)});
        if (!userMovimentationById) {
            errors["400.3"].message = "no movimentation found in server";
            return res.status(errors["400.3"].code).send(errors["400.3"]);
        }
        const { value, description } = req.body;
        const movimentation = {
            value: typeof value !== "number" ? value : Number(Number(value).toFixed(2)),
            description: stripHtml(description).result,
            isEntry: userMovimentationById.isEntry,
            userId: userMovimentationById.userId,
            created: userMovimentationById.created,
        };
        const movimentationValidation = await validateMovimentation(movimentation);
        if (movimentationValidation.status !== "ok") {
            errors["400.3"].message = movimentationValidation.message;
            return res.status(errors["400.3"].code).send(errors["400.3"]);
        }
        await getDbInstance().collection("movimentations").updateOne({
            _id: userMovimentationById._id,
        }, {
            $set: movimentation,
        });
        return res.status(200).send({code: 201, message: "movimentation updated successfully"});
    } catch {
        errors["400.3"].message = "invalid movimentation id";
        return res.status(errors["400.3"].code).send(errors["400.3"]);
    }
});

router.all("/movimentations/delete/:id", verifyUserIsLoggedIn, async (req, res) => {
    if (req.method !== "DELETE") return res.status(errors[405].code).send(errors[405]);
    const { id } = req.params;
    try {
        const deletedMovimentation = await getDbInstance().collection("movimentations").deleteOne({userId: req.user._id, _id: ObjectId(id)});
        if (deletedMovimentation.deletedCount === 0) {
            errors["400.3"].message = "no movimentation deleted";
            return res.status(errors["400.3"].code).send(errors["400.3"]);
        }
        return res.status(200).send({code: 200, message: "movimentation deleted successfully"});
    } catch {
        errors["400.3"].message = "invalid movimentation id";
        return res.status(errors["400.3"].code).send(errors["400.3"]);
    }
});

router.all("/movimentations/:id", verifyUserIsLoggedIn, async (req, res) => {
    if (req.method !== "GET") return res.status(errors[405].code).send(errors[405]);
    const { id } = req.params;
    try {
        const userMovimentationById = await getDbInstance().collection("movimentations").findOne({userId: req.user._id, _id: ObjectId(id)});
        if (!userMovimentationById) {
            errors["400.3"].message = "no movimentation found in server";
            return res.status(errors["400.3"].code).send(errors["400.3"]);
        }
        return res.status(200).send(userMovimentationById);
    } catch {
        errors["400.3"].message = "invalid movimentation id";
        return res.status(errors["400.3"].code).send(errors["400.3"]);
    }
});

export default router;