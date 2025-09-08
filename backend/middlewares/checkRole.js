function checkRole(role) {
  console.log(`checkRole middleware initialized for role: ${role}`); 

  return function (req, res, next) {
    console.log(`checkRole executing for user:`, req.user?.role); 
    if (!req.user || req.user.role !== role) {
      console.warn(`Access denied: expected role '${role}', got '${req.user?.role}'`);
      return res.status(403).json({ success: false, error: 'Access denied: insufficient permissions' });
    }

    next();
  };
}

module.exports = checkRole;
