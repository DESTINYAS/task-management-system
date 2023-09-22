
// Authentication middleware
module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        console.log("Not authenticated")
      return res.redirect("/auth/login");
    }
    next();
  };  