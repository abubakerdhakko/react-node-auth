const router = require('express').Router();
const User = require('../model/User');
const joi = require('@hapi/joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



// register  validation
const schema = {
  name: joi.string().min(6).required(),
  email: joi.string().min(6).required().email(),
  password: joi.string().min(6).required()

}

// login   validation
const loginSchema = {
  email: joi.string().min(6).required().email(),
  password: joi.string().min(6).required()

}



router.post('/register', async (req, res) => {
  // validate data
  const { error } = joi.validate(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);
  // unique email
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) return res.status(400).send('email already exist');
  // unique name
  const nameExist = await User.findOne({ name: req.body.name })
  if (nameExist) return res.status(400).send('name already exist');
  // hash pwd
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // create a user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword

  });
  try {
    const savedUser = await user.save();
    res.send({ user: user.__id });
  } catch (err) {
    res.status(400).send(err);
  }

});


// login 

router.post('/login', async (req, res) => {

  const { error } = joi.validate(req.body, loginSchema);
  if (error) return res.status(400).send(error.details[0].message);
  // check email
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('email is wrong');
  // check pwd
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) return res.status(400).send('invalid pwd');

  // assign jwt
  const token = jwt.sign({
    _id: user._id, expiresIn: "10m"
  }, process.env.TOKEN_SECRET)
  res.header('auth-token', token).send(token)
  console.log(token)
});




module.exports = router;
