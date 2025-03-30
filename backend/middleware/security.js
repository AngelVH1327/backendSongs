// Middleware para prevenir inyecciones NoSQL y otros ataques
module.exports = function(req, res, next) {
    // Función para sanitizar un objeto
    const sanitizeObject = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        
        const sanitized = {};
        
        for (const [key, value] of Object.entries(obj)) {
            // Rechazar claves con caracteres de inyección NoSQL
            if (typeof key === 'string' && (
                key.includes('$') || 
                key.includes('.') || 
                key.startsWith('__')
            )) {
                continue;
            }
            
            // Recursivamente sanitizar objetos anidados
            if (value && typeof value === 'object') {
                if (Array.isArray(value)) {
                    sanitized[key] = value.map(item => 
                        typeof item === 'object' ? sanitizeObject(item) : item
                    );
                } else {
                    sanitized[key] = sanitizeObject(value);
                }
            } else {
                sanitized[key] = value;
            }
        }
        
        return sanitized;
    };
    
    // Sanitizar body, query y params
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    
    if (req.query) {
        req.query = sanitizeObject(req.query);
    }
    
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }
    
    next();
};