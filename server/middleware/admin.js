const adminMiddleware = (req, res, next) => {
    try {
        // Check if user info is available (should be set by authMiddleware)
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. Authentication required.' 
            });
        }

        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Admin privileges required.' 
            });
        }

        // User is authenticated and has admin role
        next();

    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

module.exports = adminMiddleware;