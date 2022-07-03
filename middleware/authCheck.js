import jwt from 'jsonwebtoken';

export default (req, res ,next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token,'cesareans');
            req.userId = decoded._id;
            next();
        } catch (err) {
            return res.status(400).json({
                message: 'Error, wrong data!',
                err: err
            });
        }
    } else {
        return res.status(403).json({
            message: 'Error, Access denied!',
        });
    }
}
