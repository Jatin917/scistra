import jwt from 'jsonwebtoken'


export const blogMiddleware = async (req, res, next) =>{
    try {
        console.log(req.headers);
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: 'Access denied. No token provided.' });
        }
        const response = jwt.verify(token, process.env.SECRET_KEY);
        if(!response){
            return res.status(401).json({
                message:"Invalid Token"
            })
        }
        req.userId = response;
        next();
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}