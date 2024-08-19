// SQL Injection detection patterns
 const sqlInjectionPatterns = [
    /union\s+select/i,
    /select\s+.*from\s+.*where/i,
    /insert\s+into/i,
    /drop\s+table/i,
    /update\s+.*set/i,
    /or\s+1=1/i,
    /--\s+|#\s+|\/\*\s+|\*\//i,
    /union\s+all\s+select/i,
    /having\s+1=1/i,
    /and\s+1=1/i,
    /concat\(/i,
    /union\s+select\s+.*from\s+information_schema.tables/i,
    /union\s+select\s+.*from\s+mysql.db/i
];

// XSS detection patterns
 const xssPatterns = [
    /<script.*?>.*?<\/script>/i,
    /on\w+\s*=\s*(['"]).*?\1/i,
    /<img\s+.*?src\s*=\s*['"].*?['"].*?>/i,
    /<iframe.*?>.*?<\/iframe>/i,
    /<svg.*?onload\s*=\s*.*?>/i,
    /<a\s+.*?href\s*=\s*['"].*?javascript:.*?['"].*?>.*?<\/a>/i,
    /<.*?onerror\s*=\s*['"].*?['"].*?>/i,
    /<\/?\w+((\s+\w+(\s*=\s*(["']).*?\4|\S+))?)*\s*\/?>/i
];

module.exports = { sqlInjectionPatterns, xssPatterns };
