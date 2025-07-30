import AuthModel from "../models/auth.model.js";

const userDetails = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await AuthModel.findById(id);
    const userInfo = {
      id: user._id,
      name: user.name,
      verified: user.isVerifiedEmail,
      email: user.email,
      role: user.role,
    };
    return res.status(200).json({ status: true, userInfo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "server error" });
  }
};
export { userDetails };
