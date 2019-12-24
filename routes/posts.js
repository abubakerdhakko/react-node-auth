const router = require('express').Router();
const verify = require('./verifyToken')


router.get('/',verify,  (req, res, ) => {

  // res.json({
  //   posts: {
  //     title: 'myist post',
  //     description: 'radon post data'
  //   }
  // })
  res.send(req.user)
});

module.exports = router;