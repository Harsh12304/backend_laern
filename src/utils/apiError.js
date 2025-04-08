// Create a custom error class that extends the built-in Error class
class apiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong", // default message
        errors = [],                      // array of individual errors (optional)
        stack = ""                        // stack trace (optional)
    ) {
        // Call the parent Error class with the message
        super(message);

        // Custom properties for API error
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;  // Used in API response to indicate failure
        this.errors = errors;

        // Set stack trace
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
