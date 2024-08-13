// Error handling utility function
const errorHandler = (error, res) => {
    // Handle validation errors
    if (error.name === "ValidationError") {
        // Extract validation error messages
        const validationErrors = Object.values(error.errors).map(
            (err) => err.message
        );
        // Respond with a 400 Bad Request status and validation error messages
        res.status(400).json({
            message: "Bad Request",
            errors: validationErrors,
        });
        return;
    }

    // Handle duplicate key errors (e.g., unique constraint violations)
    if (error.code === 11000) {
        // Identify the duplicate field
        let duplicateField = Object.keys(error.keyPattern)[0];
        // Respond with a 400 Bad Request status and a message indicating the duplicate field
        res.status(400).json({ message: `${duplicateField} already exists` });
        return;
    }

    // Handle specific custom error message for missing user ID
    if (error.message === 'User ID not provided in request or event metadata.') {
        // Respond with a 422 Unprocessable Entity status and the error message
        res.status(422).json({ error: error.message });
        return;
    }

    if (error.message === 'This email has not been registered on our system' || error.message === 'Invalid password'){
        res.status(400).json({ message: 'Invalid username or password'});
    }

    // Handle any other unexpected errors
    else {
        // Respond with a 500 Internal Server Error status and the error message
        res.status(500).json({ error: `An unexpected error occurred - ${error.message}` });
    }
};

module.exports = errorHandler;
