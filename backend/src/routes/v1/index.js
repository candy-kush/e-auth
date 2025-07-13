const express = require('express');
const authRoute = require('./auth.routes');

const router = express.Router();

const contextRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
];

contextRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;