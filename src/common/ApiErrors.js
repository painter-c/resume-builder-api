function ApiError(statusCode, name, message, details) {
    this.statusCode = statusCode
    this.name = name
    this.message = message
    this.details = details
}
ApiError.prototype = new Error()

function didConstruct(error) {
    return error instanceof ApiError
}

function MissingFieldError(fieldName) {
    return new ApiError(400, 'MissingFieldError',
        'A required field was not present in the request',
        {field: fieldName})
}

function InvalidEmailError(email) {
    return new ApiError(400, 'InvalidEmailError',
        'Provided email is not valid',
        {email})
}

function WeakPasswordError(problems) {
    return new ApiError(400, 'WeakPasswordError',
        'The password did not meet one or more requirements',
        {problems})
}

module.exports = {
    didConstruct,
    MissingFieldError,
    InvalidEmailError,
    WeakPasswordError
}