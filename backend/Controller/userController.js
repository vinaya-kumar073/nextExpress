
import jwt from "jsonwebtoken"
import UserModel from "../models/userModel.js"
import bcrypt from "bcrypt"



class userController {
    // static loginUser = async (req, res) => {
    //     try {
    //         const { email, password } = req.body
    //         console.log(req.body)

    //         const user = await Session.findOne({ email })

    //         if (!user) {
    //             return res.status(401).json({
    //                 success: false,
    //                 message: "Invalid email or password"
    //             })
    //         }

    //         const isPasswordRight = password === user.password ? true : false

    //         if (!isPasswordRight) {
    //             return res.status(409).json({
    //                 success: false,
    //                 message: "Invalid email or password"
    //             })
    //         }


    //         const token = jwt.sign(
    //             {
    //                 UserId: user._id,
    //                 role: 'student'
    //             },
    //             process.env.JWT_SECRET,
    //             {
    //                 expiresIn: "1d"
    //             }
    //         )

    //         res.status(200).json({
    //             success: true,
    //             message: "Login successful.",
    //             token
    //         })
    //     } catch (error) {
    //         res.status(500).json({
    //             success: false,
    //             message: error.message
    //         })
    //     }
    // }

    static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email)
      const userIP = req.ip || req.socket.remoteAddress;
      // Check if email and password are provided
      if (!email || !password) {
        return res.status(400).json({
          status: "failed",
          message: "Email and password are required",
        });
      }
      const cleanEmail = email.trim().toLowerCase();
      // Check if user exists (case-insensitive email search)
      const user = await UserModel.findOne({
        email: { $regex: `^${cleanEmail}$`, $options: "i" }
      });

      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "Invalid Email or Password" });
      }
      // Check if user is verified
      if (!user.is_verified) {
        return res
          .status(401)
          .json({ status: "failed", message: "Your auth is not verified" });
      }
      const allowedStatuses = ["ACCEPTED", "ACTIVE", "NOTICE_PERIOD"];
      if (!allowedStatuses.includes(user.status)) {
        return res.status(401).json({
          status: "failed",
          message: "Your account status is not verified for login",
        });
      }
      // Compare passwords securely (supports both bcrypt hashed and plaintext passwords)
      let isPasswordMatch = await bcrypt.compare(password, user.password).catch(() => false);
      if (!isPasswordMatch && password === user.password) {
        isPasswordMatch = true;
      }

      console.log("[USER LOGIN] Password match result:", isPasswordMatch);
      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ status: "failed", message: "Invalid email or password" });
      }

      // Generate JWT Token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          adminType: user.adminType,
          technicalPersonType: user.technicalPersonType,
          salesPersonType: user.salesPersonType,
          taType: user.taType,
          operationsPersonType: user.operationsPersonType,
          technicalPersonType: user.technicalPersonType,
          accountantType: user.accountantType,
          customId: user.customId,
          employeeId: user.employeeId,
          subordinates:user.subordinates,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }, 
      );

      res.cookie("token",token,{
        httpOnly:true,
        sameSite:"lax",
        maxAge: 24*60*60*1000,
      })

      return res.status(200).json({
        user: {
          userId: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          adminType: user.adminType,
          technicalPersonType: user.technicalPersonType,
          salesPersonType: user.salesPersonType,
          taType: user.taType,
          operationsPersonType: user.operationsPersonType,
          accountantType: user.accountantType,
          technicalPersonType: user.technicalPersonType,
          customId: user.customId,
          employeeId: user.employeeId,
        },
        status: "success",
        message: "Login successful",
        is_auth: true,
      });

      // Save user's login zone information
      // saveZone(userIP, user._id);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to login, please try again later",
      });
    }
  };

  static changeUserPassword = async (req, res) => {
    try {
      const { email, currentpassword, password, password_confirmation } =
        req.body;

        // console.log(req.body)
        // console.log(req.user)

        console.log(email)

        const normalizedEmail = email.trim().toLowerCase()
        console.log(normalizedEmail)

        // user email must be equal to token's email where user login
        const isEmailRight = normalizedEmail === req.user.email
        console.log(isEmailRight)

        if(!isEmailRight){
            return res.status(401).json({
                success:false,
                message:"Invaild token"
            })
        }
        
        //password checking

        if(currentpassword===password){
            return res.status(401).json({
                success:false,
                message: "Password must be different from current password."
            })
        }
        if(password.length<6){
            return res.status(400).json({
                success:false,
                message: "The password must be greater than 8."
            })
        }
        if (!password || !password_confirmation) {
          return res.status(400).json({
            status: "failed",
            message: "New Password and Confirm New Password are required",
          });
        }
  
        if (password !== password_confirmation) {
          return res.status(400).json({
            status: "failed",
            message: "New Password and Confirm New Password don't match",
          });
        }
      const user = await UserModel.findOne({ email:normalizedEmail });

      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "User not found" });
      }


      const isMatch = await bcrypt.compare(currentpassword, user.password);
      
    // const isMatch = currentpassword===user.password
      console.log(isMatch)

      if (!isMatch) {
        return res
          .status(401)
          .json({ status: "failed", message: "Invalid current password" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      await UserModel.findByIdAndUpdate(user._id, {
        $set: { password: hashedPassword },
      });

      return res
        .status(200)
        .json({ status: "success", message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to change password, please try again later",
      });
    }
  };

  static logout = async(req,res)=>{
    try {
      res.clearCookie("token",{
        httpOnly:true,
        sameSite:'lax'
      })

      return res.status(200).json({
        success:true,
        message: "logout sccessful"
      })
    } catch (error) {
      console.error("LOGOUT ERROR",error)
      return res.status(500).json({
        success:false,
        message: "logout failed"
      })
    }
  }      
  
  static getMe = (req,res)=>{
    try {
      console.log("this is get me token: ",req.cookies.token)
      return res.status(200).json({
        success: true,
        is_auth: true,
        user: req.user
      })
    } catch (error) {
      console.error("GET ME ERROR",error)

      return res.status(404).json({
        success:false,
        message:"This is user is not authenticated."
      })
    }
  }

}

export default userController