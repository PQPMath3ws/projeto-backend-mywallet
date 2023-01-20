const setError = (code, message) => ({code, message});

const errors = {
    400.1: setError(400, "email and/or password invalid"),
    400.2: setError(400, "\"password\" and \"confirmationPassword\" are different"),
    400.3: setError(400, ""),
    401.1: setError(401, "invalid authorization token in request"),
    404: setError(404, "route not found"),
    405: setError(405, "method not allowed"),
    409: setError(409, "failed to register this user"),
    415: setError(415, "invalid content-type"),
};

export default errors;