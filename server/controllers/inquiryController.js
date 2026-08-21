// // FILE: server/controllers/inquiryController.js
// import mongoose from "mongoose";
// import * as inquiryService from "../services/inquiryService.js";
// import User from "../models/User.js";
// import { verifyAuthToken } from "../utils/authUtils.js";

// export const submitInquiry = async (req, res) => {
//   try {
//     let userId = null;

//     const authHeader = req.headers.authorization;
//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       const token = authHeader.slice(7);
//       try {
//         const decoded = verifyAuthToken(token);
//         userId = decoded.id || decoded._id || decoded.userId;
//       } catch (err) {
//         // console.log("Invalid token, proceeding as guest.");
//       }
//     }

//     const inquiry = await inquiryService.createInquiry(req.body, userId);
//     res.status(201).json({ success: true, inquiry });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getInquiries = async (req, res) => {
//   try {
//     const data = await inquiryService.getAllInquiries(req.query);
//     res.json({ success: true, ...data });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getMyInquiries = async (req, res) => {
//   try {
//     const userId =
//       req.authUser?.id || req.authUser?._id || req.authUser?.userId;

//     const userEmail = req.authUser?.email;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized. Please login.",
//       });
//     }

//     const inquiries = await inquiryService.getUserInquiries(userId, userEmail);

//     res.json({
//       success: true,
//       inquiries,
//     });
//   } catch (error) {
//     // console.error("GET MY INQUIRIES ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const updateStatus = async (req, res) => {
//   try {
//     const inquiry = await inquiryService.updateInquiryStatus(
//       req.params.id,
//       req.body,
//     );
//     res.json({ success: true, inquiry });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const replyToInquiry = async (req, res) => {
//   try {
//     const userObj = req.authUser || {};
//     let senderId = userObj.id || userObj._id || userObj.userId;
//     const role = userObj.role || "admin";

//     if (!senderId) senderId = "000000000000000000000000";

//     //  Ownership check for customers
//     if (role === "customer") {
//       const owned = await inquiryService.isInquiryOwnedByUser(
//         req.params.id,
//         senderId,
//         userObj.email,
//       );
//       if (!owned) {
//         return res.status(403).json({
//           success: false,
//           message: "You do not have access to this inquiry.",
//         });
//       }
//     }

//     const inquiry = await inquiryService.addReplyToInquiry(
//       req.params.id,
//       senderId,
//       role,
//       req.body.message,
//     );
//     res.json({ success: true, inquiry });
//   } catch (error) {
//     console.error("Reply Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const markViewed = async (req, res) => {
//   try {
//     const { role, id, email } = req.authUser;

//     // Ownership check for customers
//     if (role === "customer") {
//       const owned = await inquiryService.isInquiryOwnedByUser(
//         req.params.id,
//         id,
//         email,
//       );

//       if (!owned) {
//         return res.status(403).json({
//           success: false,
//           message: "You do not have access to this inquiry.",
//         });
//       }
//     }

//     const inquiry = await inquiryService.markInquiryAsViewed(
//       req.params.id,
//       role,
//     );

//     res.json({
//       success: true,
//       inquiry,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getSingleInquiry = async (req, res) => {
//   try {
//     const inquiry = await inquiryService.getInquiryById(req.params.id);
//     res.json({ success: true, inquiry });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const deleteInquiry = async (req, res) => {
//   try {
//     await inquiryService.deleteInquiryById(req.params.id);
//     res.json({ success: true, message: "Inquiry deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// FILE: server/controllers/inquiryController.js
import mongoose from "mongoose";
import * as inquiryService from "../services/inquiryService.js";
import User from "../models/User.js";
import { verifyAuthToken } from "../utils/authUtils.js";

export const submitInquiry = async (req, res) => {
  try {
    let userId = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        const decoded = verifyAuthToken(token);
        userId = decoded.id || decoded._id || decoded.userId;
      } catch (err) {
        // console.log("Invalid token, proceeding as guest.");
      }
    }

    const inquiry = await inquiryService.createInquiry(req.body, userId);
    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const data = await inquiryService.getAllInquiries(req.query);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyInquiries = async (req, res) => {
  try {
    const userId =
      req.authUser?.id || req.authUser?._id || req.authUser?.userId;

    const userEmail = req.authUser?.email;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    // JWT payload doesn't carry phone, so fetch it once here — needed so
    // inquiries linked only by phone number (not yet by userId/email)
    // still show up for this user.
    const userDoc = await User.findById(userId).select("phone").lean();
    const userPhone = userDoc?.phone;

    const inquiries = await inquiryService.getUserInquiries(
      userId,
      userEmail,
      userPhone,
    );

    res.json({
      success: true,
      inquiries,
    });
  } catch (error) {
    // console.error("GET MY INQUIRIES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const inquiry = await inquiryService.updateInquiryStatus(
      req.params.id,
      req.body,
    );
    res.json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyToInquiry = async (req, res) => {
  try {
    const userObj = req.authUser || {};
    let senderId = userObj.id || userObj._id || userObj.userId;
    const role = userObj.role || "admin";

    if (!senderId) senderId = "000000000000000000000000";

    //  Ownership check for customers
    if (role === "customer") {
      // Fetch phone once — JWT payload doesn't carry it, and the
      // ownership check now requires email + phone together.
      const userDoc = await User.findById(senderId).select("phone").lean();

      const owned = await inquiryService.isInquiryOwnedByUser(
        req.params.id,
        senderId,
        userObj.email,
        userDoc?.phone,
      );
      if (!owned) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this inquiry.",
        });
      }
    }

    const inquiry = await inquiryService.addReplyToInquiry(
      req.params.id,
      senderId,
      role,
      req.body.message,
    );
    res.json({ success: true, inquiry });
  } catch (error) {
    console.error("Reply Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markViewed = async (req, res) => {
  try {
    const { role, id, email } = req.authUser;

    // Ownership check for customers
    if (role === "customer") {
      // Fetch phone once — JWT payload doesn't carry it, and the
      // ownership check now requires email + phone together.
      const userDoc = await User.findById(id).select("phone").lean();

      const owned = await inquiryService.isInquiryOwnedByUser(
        req.params.id,
        id,
        email,
        userDoc?.phone,
      );

      if (!owned) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this inquiry.",
        });
      }
    }

    const inquiry = await inquiryService.markInquiryAsViewed(
      req.params.id,
      role,
    );

    res.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleInquiry = async (req, res) => {
  try {
    const inquiry = await inquiryService.getInquiryById(req.params.id);
    res.json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    await inquiryService.deleteInquiryById(req.params.id);
    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
