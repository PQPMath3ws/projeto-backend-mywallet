import { stripHtml } from "string-strip-html";

import errors from "../const/errors.js";
import { getDbInstance } from "../config/database.js";

const verifyUserIsLoggedIn = async function (req, res, next) {
    let { authorization } = req.headers;
    if (typeof authorization !== "string") return res.status(errors["401.1"].code).send(errors["401.1"]);
    authorization = stripHtml(authorization).result;
    if (!authorization.includes("Bearer")) return res.status(errors["401.1"].code).send(errors["401.1"]);
    authorization = authorization.replace("Bearer ", "");
    const auth = await getDbInstance().collection("usersAuth").findOne({token: authorization});
    if (!auth) return res.status(errors["401.1"].code).send(errors["401.1"]);
    const user = await getDbInstance().collection("users").findOne({_id: auth.userId});
    if (!user) return res.status(errors["401.1"].code).send(errors["401.1"]);
    req.user = user;
    next();
};

export default verifyUserIsLoggedIn;