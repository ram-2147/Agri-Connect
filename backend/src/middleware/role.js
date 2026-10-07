const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied for this role' });
  }
  next();
};

const requireApprovedFarmer = (req, res, next) => {
  if (req.user.role !== 'farmer') {
    return res.status(403).json({ message: 'Farmers only' });
  }
  if (!req.user.farmerProfile?.approved) {
    return res
      .status(403)
      .json({ message: 'Your farmer account is pending admin approval' });
  }
  next();
};

module.exports = { authorize, requireApprovedFarmer };
