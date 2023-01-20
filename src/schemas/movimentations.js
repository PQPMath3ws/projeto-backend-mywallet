import Joi from "joi";

const MovimentationsSchema = Joi.object({
    value: Joi.number().precision(2).required(),
    description: Joi.string().min(6).max(50).required(),
    isEntry: Joi.boolean().required(),
    userId: Joi.object().required(),
    created: Joi.date().required(),
});

async function validateMovimentation(movimentation) {
    try {
        await MovimentationsSchema.validateAsync(movimentation, { convert: false });
        return {
            status: "ok",
            message: "movimentation validated successfully",
        };
    } catch (error) {
        return {
            status: "error",
            message: error.details[0].message,
        };
    }
}

export { validateMovimentation };