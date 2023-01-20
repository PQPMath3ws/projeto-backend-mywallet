import Joi from "joi";

const MovimentationsSchema = Joi.object({
    value: Joi.number().precision(2).required(),
    description: Joi.string().min(6).max(50).required(),
    isEntry: Joi.boolean().required(),
    userId: Joi.string().min(24).max(24).regex(/^[a-f0-9]{24}$/).required(),
    created: Joi.date().required(),
});

async function validateMovimentation(movimentation) {
    try {
        await MovimentationsSchema.validateAsync(movimentation);
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