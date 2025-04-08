// A standard class for formatting all API responses in a consistent structure
class apiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;  // HTTP status code (200, 400, etc.)
        this.data = data;              // Actual data you want to send in response
        this.message = message;        // Message to send (e.g., success or error)
        this.success = statusCode < 400; // If status is <400, it's a success
    }
}
