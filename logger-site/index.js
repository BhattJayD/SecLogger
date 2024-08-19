const express = require('express');

const { insertLog } = require('./db');

const app = express();
const port = 4000;

const rateLimit = require('express-rate-limit');
const { sqlInjectionPatterns, xssPatterns } = require('./constants');

let SQLI = 0;
let XSS = 0;
let bruteForceCount = 0; // Brute-force counter




// Rate limit configuration
const bruteForceLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    handler: (req, res, next, options) => {
        // Custom rate limit exceeded handler
        bruteForceCount += 1; // Increment brute-force attempt count
        console.warn(`Brute-force threshold exceeded from IP: ${req.ip}`);
        console.log('Brute-force Attempt Count:', bruteForceCount);
        res.status(options.statusCode).send(options.message);
    }
});

// Middleware to detect directory brute-forcing based on any path
const detectBruteForcing = (req, res, next) => {
    const requestedPath = req.path;
    // console.warn(`Potential brute-force attempt detected for path: ${requestedPath} from IP: ${req.ip}`);
    next();
};

app.use(express.json());
app.use(bruteForceLimiter); // Apply rate limiting middleware
app.use(detectBruteForcing); // Apply brute-force detection middleware

app.post('/log', async (req, res) => {
    console.log('Received log:', req.body.message.body);

    let sqlInjectionDetected = false; // Flag to indicate if SQLi was detected
    let xssDetected = false; // Flag to indicate if XSS was detected

    // Check for SQL injection patterns
    if (req.body.message?.body) {
        for (const pattern of sqlInjectionPatterns) {
            const keys = Object.keys(req.body.message.body);

            for (const key of keys) {
                if (pattern.test(req.body.message.body[key])) {
                    if (!sqlInjectionDetected) {
                        console.warn('Potential SQL injection detected:', req.body.message.body[key]);
                        SQLI += 1;
                        console.log('SQL Injection Count:', SQLI);
                        sqlInjectionDetected = true; // Set flag to true to stop further checks
                    }
                }
            }

            if (sqlInjectionDetected) {
                // If SQL injection was detected, respond with an error and exit
                return res.status(400).send('Bad Request: SQL injection attempt detected.');
            }
        }

        // Check for XSS patterns
        for (const pattern of xssPatterns) {
            const keys = Object.keys(req.body.message.body);

            for (const key of keys) {
                if (pattern.test(req.body.message.body[key])) {
                    if (!xssDetected) {
                        console.warn('Potential XSS attack detected:', req.body.message.body[key]);
                        XSS += 1;
                        console.log('XSS Count:', XSS);
                        xssDetected = true; // Set flag to true to stop further checks
                    }
                }
            }

            if (xssDetected) {
                // If XSS was detected, respond with an error and exit
                return res.status(400).send('Bad Request: XSS attempt detected.');
            }
        }
    }



    // Store the log in the database
    await insertLog(JSON.stringify(req.body));

    // If no attack was detected, respond with a success message
    res.status(200).send('Log received');
});
app.get('/report',(req,res)=>{
    res.status(200).send(JSON.stringify({sqli:SQLI,xxs:XSS,bruteforcecount:bruteForceCount}))
})
app.listen(port, () => {
    console.log(`Logger server running on port ${port}`);
});
