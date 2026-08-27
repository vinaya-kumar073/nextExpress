import Session from "../models/sessionModel.js";
import mongoose from "mongoose";
class sessionController {
  static upcomingSession = async (req, res) => {
    try {
      const { studentId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({
          success: false,
          message: "Input must be correct"
        })
      }
      console.log("the student id: " + studentId, req.params)
      console.log(req.user.UserId)

      if (req.user.role !== "student" && req.user.UserId !== studentId) {
        return res.status(403).json({
          success: false,
          message: "Only student can access the sessions."
        })
      }

      console.log(req.user.role, req.user.UserId)

      const {
        status,
        from,
        to,
      } = req.query;

      const page = Number(req.query.page || 1)

      if (!Number.isInteger(page) || page < 1) {
        return res.status(403).json({
          success: false,
          message: "Value must be positive"
        })
      }

      const limit = Number(req.query.limit || 10)

      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        return res.status(403).json({
          success: false,
          message: "Limit must be in range"
        })
      }

      const skip = (page - 1) * limit;

      const filter = {
        students: studentId,
        status: status || {
          $in: ["scheduled", "live"],
        },
      };

      // if (from) {
      //   filter.startTime = {
      //     $gte: new Date(from),
      //   };
      // }

      // if (to) {
      //   filter.startTime = {
      //     $lte: new Date(to),
      //   };
      // }
      if (from || to) {
        filter.startTime = {}
        if (from) {
          const fromDate = new Date(from)
          if (!Number.isNaN(fromDate.getTime())) {
            return res.status(400).json({
              success: false,
              message: "From date must be in correct format."
            })
          }
          filter.startTime.$gte = fromDate
        }
        if (to) {
          const toDate = new Date(to)
          if (!Number.isNaN(toDate.getTime())) {
            return res.status(400).json({
              success: false,
              message: "To date must be in correct format."
            })
          }
          filter.startTime.$lte = toDate
        }
      }
      const sessions = await Session.find(filter)
        .populate("course", "name")
        .populate("instructor", "name email")
        .sort({ startTime: 1 })
        .skip(skip)
        .limit(limit);

      const total = await Session.countDocuments({ filter });

      return res.json({
        success: true,
        data: sessions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("GET SESSIONS ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch sessions",
      });
    }
  }

  static updateSession = async (req, res) => {
    try {
      const { sessionId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        return res.status(400).json({
          success: false,
          message: "Input must be correct"
        })
      }
      const {
        title,
        startTime,
        endTime,
        status,
        instructorId,
      } = req.body;

      const session = await Session.findById(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      const isAdmin = req.user.role === "admin"
      const isInstructor = session.instructor === req.user.UserId

      if (!isAdmin && !isInstructor) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to update this session",
        });
      }

      session.title = title || session.title;
      session.startTime = startTime || session.startTime;
      session.endTime = endTime || session.endTime;
      session.status = status || session.status;
      session.instructor = instructorId || session.instructor;

      await session.save();

      return res.json({
        success: true,
        message: "Session updated successfully",
        data: session,
      });
    } catch (error) {
      console.error("UPDATE SESSION ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update session",
      });
    }
  }

  static deleteSession = async (req, res) => {
    try {
      const { sessionId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        return res.status(400).json({
          success: false,
          message: "Input must be correct"
        })
      }

      const session = await Session.findById(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      await Session.deleteOne({
        _id: sessionId,
      });

      return res.status(200).json({
        success: true,
        message: "Session deleted successfully",
        data: session,
      });
    } catch (error) {
      console.error("DELETE SESSION ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete session",
      });
    }
  }
}

export default sessionController;