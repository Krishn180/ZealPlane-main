const Notification = require("../models/notificationModel");
const User = require("../models/userModel");


// ✅ Fetch notifications for the logged-in user using UUID
const getNotifications = async (req, res) => {
  try {
    console.log("=== Fetch Notifications ===");
    console.log("Request user object from token:", req.user);

    const userUUID = req.user?.uniqueId; // fetch UUID from token
    if (!userUUID) {
      console.log("❌ No uniqueId found in token!");
      return res
        .status(400)
        .json({ message: "User uniqueId missing from token" });
    }

    console.log("Fetching notifications for uniqueId:", userUUID);
    const notifications = await Notification.find({ recipient: userUUID }) // fetch by UUID
      .populate("sender", "username profilePic")
      .sort({ createdAt: -1 });

    console.log("✅ Notifications fetched from DB:", notifications);

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create a notification (to be called from comment logic)
const createNotification = async (
  recipientUniqueId,
  senderId,
  message,
  projectId,
  commentId
) => {
  console.log("=== Create Notification ===");
  console.log("Recipient UUID:", recipientUniqueId);
  console.log("SenderId:", senderId);
  console.log("Message:", message);
  console.log("ProjectId:", projectId);
  console.log("CommentId:", commentId);

  // Don't create notification if recipient is missing or same as sender
  if (!recipientUniqueId || recipientUniqueId === senderId) {
    console.log("❌ No notification needed (missing recipient or self-action)");
    return;
  }

  try {
    const notification = new Notification({
      recipient: recipientUniqueId, // use UUID here
      sender: senderId, // can still be Mongo ObjectId
      type: "comment",
      message,
      projectId,
      commentId,
    });

    const savedNotification = await notification.save();
    console.log("✅ Notification created successfully:", savedNotification);
    return savedNotification;
  } catch (error) {
    console.error("❌ Error creating notification:", error);
  }
};

// ✅ Mark notification as read
const markAsRead = async (req, res) => {
  try {
    console.log("=== Mark Notification As Read ===");
    const notificationId = req.params.notificationId;
    console.log("NotificationId to mark as read:", notificationId);

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      console.log("❌ Notification not found");
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    const updatedNotification = await notification.save();
    console.log("✅ Notification marked as read:", updatedNotification);

    return res.status(200).json(updatedNotification);
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
};
