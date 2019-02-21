const Joi = require('joi')
const passwordRegex = /^(?:[\w@]+){6,20}$/

const signupJoiSchema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .regex(passwordRegex)
    .required(),
})

const notesJoiSchema = Joi.object().keys({
  title: Joi.string()
    .min(3)
    .max(30)
    .required(),
  text: Joi.string()
    .min(10)
    .required(),
})

module.exports = {
  signupJoiSchema,
  notesJoiSchema,
}
