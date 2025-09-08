module.exports = (req, res, next) => {
  req.user = {
    _id: '64f1c2e4a2b3c1d5e6f7a8b9', // use a valid ObjectId from your DB
    role: 'organizer',             // or 'volunteer' depending on the test
    name: 'Test User',
    email: 'test@example.com'
  };
  console.log('✅ Mock user injected:', req.user);
  next();
};
