import { User } from "../models/User.js";

export class UserController {
  static getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static createUser = async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json({ name: user.name, code: user.employeeCode });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static loginUser = async (req, res) => {
    console.log(req.body);
    try {
      const { employeeCode, password } = req.body;
      if (!employeeCode || !password)
        return res
          .status(400)
          .json({ message: "Please provide emp code and password" });
      const user = await User.findOne({ employeeCode: employeeCode });
      if (!user) return res.status(404).json({ message: "User not found" });
      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });
      const token = await user.generateToken();
      res.status(200).json({ message: `Welcome ${user.name}`, token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        user = await User.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(200).json({ message: "User updated successfully", user });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json({ msg: "User deleted successfully", user });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


}
