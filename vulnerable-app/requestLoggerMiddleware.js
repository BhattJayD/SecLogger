const axios = require('axios');
const flatted = require('flatted');

const sqlInjectionPatterns = [
    /union\s+select/i,
    /select\s+.*from\s+.*where/i,
    /insert\s+into/i,
    /drop\s+table/i,
    /update\s+.*set/i,
    /or\s+1=1/i,
    /--\s+|#\s+|\/\*\s+|\*\//i
];


// Middleware function to log request details
const requestLoggerMiddleware = (req, res, next) => {
    // Serialize the request object using flatted
    const requestDetails = {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body
    };

    // Send the serialized request details to the external service
    axios.post('http://localhost:4000/log', { message: requestDetails })
        .then(response => { console.log('Logged request details:', response.data) ;})
        .catch(error => console.error('Error logging request:', error));

    // Proceed to the next middleware or route handler
    next();
};

module.exports = requestLoggerMiddleware;
