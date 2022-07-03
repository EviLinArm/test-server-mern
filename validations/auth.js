import {body} from 'express-validator'

export const registerValidation = [
    body('name', 'Wrong name').isLength({min: 3}),
    body('email', 'Wrong email').isEmail(),
    body('password', 'Wrong password').isLength({min: 6}),
    body('dob', 'Wrong date of birth').isLength({min: 6}),
    body('sex', 'Wrong sex').isLength({min: 3}),
    body('userPhoto', 'Wrong user photo').optional().isObject(),
];

export const loginValidation = [
    body('email', 'Wrong email').isEmail(),
    body('password', 'Wrong password').isLength({min: 6}),
];

export const updateValidation = [
    body('name', 'Wrong name').optional().isLength({min: 3}),
    body('password', 'Wrong password').optional().isLength({min: 6}),
    body('userPhoto', 'Wrong user photo').optional().isObject(),
];