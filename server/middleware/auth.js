/**
 * Middleware factory to authorize user access based on role
 *
 * @param {String} requiredRole
 * Role required to access route ('student', 'faculty', 'admin')
 */
export const checkRole = (requiredRole) => {
  return (req, res, next) => {
    // Read user role header passed from client
    const userRole = req.headers['x-user-role'];

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: 'Authentication Failure: Missing authorization identity headers'
      });
    }

    // Check permissions
    if (userRole !== requiredRole && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `Forbidden Action: Access requires '${requiredRole}' privileges. Provided role: '${userRole}'`
      });
    }

    // Role authorized -> continue to target route
    next();
  };
};
