import JWT from "jsonwebtoken";



//projected routrs
export const requireSignup = async (req, res, next) => {
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET);
        req.user = decode
        next();
    } catch (error) {

    }
};


