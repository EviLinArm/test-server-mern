import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const crypt = await bcrypt.genSalt(8);
        const hash = await bcrypt.hash(password, crypt);

        const doc = new UserModel({
            name: req.body.name,
            email: req.body.email,
            passwordHash: hash,
            dob: req.body.dob,
            sex: req.body.sex,
            userPhoto: req.body.userPhoto,
        });

        const user = await doc.save();

        const token = jwt.sign({
                _id: user._id,
            },
            'cesareans',
            {
                expiresIn: '1d',
            },
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (err) {
        console.log(err, 'Registration error');
        res.status(500).json({
            message: 'Registration error',
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'Error, user not found!'
            });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Error, wrong input data!'
            });
        }

        const token = jwt.sign({
                _id: user._id,
            },
            'cesareans',
            {
                expiresIn: '1d',
            },
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        console.log(err, 'User login error');
        res.status(500).json({
            message: 'Login error',
        });
    }
};

export const auth = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if(!user) {
            return res.status(404).json({
                message: 'Error, user not found!'
            });
        }

        const {passwordHash, ...userData} = user._doc;

        res.json(userData);

    } catch (err) {
        console.log(err, 'Access error');
        res.status(500).json({
            message: 'Access error',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const users = await UserModel.find({}, ['name', 'dob', 'userPhoto']);

        if(!users) {
            return res.status(500).json({
                message: 'Error, users not found!'
            });
        }

        res.json(users);

    } catch (err) {
        console.log(err, 'Access error');
        res.status(500).json({
            message: 'Access error',
        });
    }
};

export const update = async (req, res) => {
    try {
        console.log(req.body)
        if ('password' in req.body) {

            const password = req.body.password;
            const crypt = await bcrypt.genSalt(8);
            const hash = await bcrypt.hash(password, crypt);

            await UserModel.updateOne({
                _id: req.userId,
            }, {
                passwordHash: hash,
            });
            console.log('pass updated!')
        }

        if ('name' in req.body) {

            await UserModel.updateOne({
                _id: req.userId,
            }, {
                name: req.body.name,
            });
            console.log('name updated!')
        }

        if ('userPhoto' in req.body) {

            await UserModel.updateOne({
                _id: req.userId,
            }, {
                userPhoto: req.body.userPhoto,
            });
            console.log('photo updated!')
        }

        if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
            console.log(req.body)
            return (
                res.status(400).json({
                    message: 'Nothing to patch',
                })
            )
        }

        res.json({
            success: 'Updated my User!',
        });

    } catch (err) {
        console.log(err, 'Access error');
        res.status(500).json({
            message: 'Access error',
        });
    }
};