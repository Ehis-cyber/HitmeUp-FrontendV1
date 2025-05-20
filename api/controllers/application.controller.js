import Application from "../models/apply.model.js";

export const submitApplication = async (req, res) => {
  try {
    const { taskId, fullName, email, phone, city, country, state, resume, portfolio } = req.body;
    const userId = req.user.id; // assuming you use JWT/session
    // Optionally, validate URLs here
    const application = new Application({
      taskId,
      userId: req.user.id, // assuming you use JWT auth
      fullName,
      email,
      phone,
      city,
      country,
      state,
      resume,
      portfolio,
    });

    await application.save();
    res.status(201).json({ message: "Application submitted!", application });
  } catch (err) {
    console.error("Application error:", err);
    res.status(500).json({ message: "Failed to submit application." });
  }
};