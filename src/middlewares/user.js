import errors from "../const/errors.js";

const verifyReqConditions = async function(req, res, next) {
    if (req.method !== "POST") return res.status(errors[405].code).send(errors[405]);
    if (req.headers["content-type"] !== "application/json") return res.status(errors[415].code).send(errors[415]);
    next();
};

export default verifyReqConditions;