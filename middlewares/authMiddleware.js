import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized", success: false, data: null });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Session expired!! Login again ", success: false, data: null });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", success: false, data: null });
    }
}

export default authMiddleware;