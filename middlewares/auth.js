import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    const {authorization} = req.headers;
    if(!authorization||!authorization.startsWith('Bearer ')){
        return res.status(401).json({message: "Please login to continue"});
    }
    const token = authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({message: "Please login to continue"});
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const {role} = data;
        if(role !== "Admin") return res.status(401).json({message: "You are not authorized to perform this action"});
        next();
    } catch (error) {
        res.status(401).json({message: "Please login to continue"});
    }
};