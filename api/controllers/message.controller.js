
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;

    const message = new Message({
      sender: req.user.id, // Authenticated user
      receiver,
      text,
    });

    const savedMessage = await message.save();

    global.io.emit("receiveMessage", savedMessage); // Broadcast the saved message to all clients
  
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    }).populate("sender receiver", "username"); // Populate sender and receiver details
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
};

export const markMessageAsRead = async (req, res) => {
    try {
      // Assuming you have the message ID in the request parameters
      const { messageId } = req.params;
  
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { read: true },
        { new: true }
      );
      
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
  
  
      res.status(200).json(updatedMessage);
    } catch (err) {
      res.status(500).json({ message: "Failed to update message status", error: err.message });
    }
  };