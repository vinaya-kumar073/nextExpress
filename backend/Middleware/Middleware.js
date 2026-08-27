import jwt from "jsonwebtoken"
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token
    console.log(req.cookies)
    console.log(req.headers)


    console.log("this is my token: ",token)

    if(!token){
      return res.status(401).json({
        success:false,
        message:"Authentication failed"
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    console.log(decoded)

    req.user = decoded


    next();
  } catch (error) {
    res.status(400).json({
      message: "Invalid or expired token",
    });
  }
};

export default authenticate;