import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';

// DELETE AFTER CHECK
import cors from 'cors';

import {registerValidation, loginValidation, updateValidation} from './validations/auth.js'
import {register, login, auth, update, getAll} from './controllers/UserController.js'
import authCheck from './middleware/authCheck.js'
import handleValidationCheck from "./middleware/handleValidationCheck.js";

mongoose
    .connect('mongodb+srv://admin:8dad40e358@cluster0.adik0.mongodb.net/pilot?retryWrites=true&w=majority')
    .then(() => console.log('Mongo OK'))
    .catch((err) => console.log('Mongo error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
// DELETE AFTER CHECK
app.use(cors());
// DELETE AFTER CHECK
app.use('/uploads', express.static('uploads'));

app.post('/register', registerValidation, handleValidationCheck, register);
app.post('/login', loginValidation, handleValidationCheck, login);

app.post('/uploads', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    });
});

app.get ('/auth', authCheck, auth);
app.get('/users', authCheck, getAll);
app.patch('/user', authCheck, updateValidation, handleValidationCheck, update);
// app.patch('/user', update);

app.listen(4004, (err) => {
    if (err) {
        return console.log('Something went wrong!', err);
    }
    console.log('Server running!');
});