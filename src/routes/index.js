const BmkgRoutes = require('../routes/bmkg_route');
// const UserRoutes = require('../routes/user_route');
// const AuthRoutes = require('../routes/auth_route');
// const JWTAuth = require('../middlewares/request-handler/jwt_auth');

module.exports = (app) => {
    // app.use('/user', JWTAuth, UserRoutes);
    // app.use('/', AuthRoutes);
    app.use('/bmkg', BmkgRoutes);
};
