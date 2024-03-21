import newsExport from "../model/model.js";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import axios from "axios";
import mongoose from "mongoose";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 3000,
  secure: false,

  auth: {
    user: "ayushpatidar062@gmail.com",
    pass: "ayupatel@6260",
  },
});

export const newsController = async (req, res) => {
  const { Name, Username, Email, Password, Contact } = req.body;
  try {
    const OTP = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    const mailOptions = {
      from: "ayushpatidar062@gmail.com",
      to: Email,
      subject: "OTP for signup verification",
      text: `Your OTP for SignUp Verification is${OTP}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("ERROR sending email:", error);
        return res.json({ msg: "Email Sending OTP:Please try again later" });
      }

      console.log("Email sent:", info.response);
    });

    const Report = await newsExport.create({
      Name,
      Username,
      Email,
      Password,
      Contact,
    });

    await Report.save();

    return res.json({ OTP, msg: "User Addded Successfully", Report });
  } catch (error) {
    console.log("Controller Error", error);
  }
};
export const login = async (req, res) => {
  try {
    const { Username, Password } = req.body;

    const Report = await newsExport.findOne({ Username });

    if (!Report || Report.Password !== Password) {
      return res.json({ message: "Invaild Username or Password" });
    }

    req.user = Report;

    await Report.save();
    console.log("Login Successfull", Report);

    return res.json({
      message: "Login Successful",
      user: { id: Report.id, Username: Report.Username, ...Report },
    });
  } catch (error) {
    console.log("Login Error", error);
    return res.json({ error: "Internal Login Error" });
  }
};

export const userUpdates = async (req, res) => {
  const { id } = req.params;
  const { Name, Username, Email, Password, Contact } = req.body;
  try {
    const user = await newsExport.findById(id);
    if (!user) {
      return res.json({ message: "User not Found" });
    }
    user.Name = Name;
    user.Username = Username;
    user.Email = Email;
    user.Password = Password;
    user.Contact = Contact;
    await user.save();
    console.log(user);
    return res.json({ msg: "User Updated Successfully", user });
  } catch (error) {
    console.log("Update User Error", error);
    return res.json({ error: "Internal Updating Error" });
  }
};

export const Userdelete = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await newsExport.findByIdAndDelete(id);
    if (!user) {
      return res.json({ message: "User not found for delete" });
    }
    return res.json({ message: "User deleted successfully", user });
  } catch (error) {
    console.log("Delete User Error", error);
    return res.json({ error: "Internal deleting Error" });
  }
};

export const searchNewsByType = async (req, res) => {
  try {
    const { type } = req.params.id;

    const response = await axios.get(
      "https://newsapi.org/docs/endpoints/everything",
      {
        params: {
          q: type,
          type,
          apiKey: "7e82271417a942759d70241ab773127a",
        },
      }
    );
    const newsArticles = response.data.articles;
    if (!newsArticles || newsArticles.length === 0) {
      res.json({ message: `No news arctiles found for type '${type}'` });
    }
    return res.json({
      message: `News articles found for type${type}`,
      news: newsArticles,
    });
  } catch (error) {
    console.log("Search news by type error", error);
    return res.json({ msg: "INTERNALSERVER ERROR" });
  }
};

//API Controller for getting latest news

export const getLatestNews = async (req, res) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        country: "us",
        apiKey: "7e82271417a942759d70241ab773127a",
      },
    });
    const latestNews = response.data.articles;
    return res.json({ message: "Latest News Articles ", news: latestNews });
  } catch (error) {
    console.log("Get Latest news error", error);
    return res.json({
      msg: "Getting latest news error Server error",
    });
  }
};

//API Controller for Category news

export const getNewsByCategory = async (req, res) => {
  try {
    const category = req.params.id;
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        country: "us",
        category,
        apiKey: "7e82271417a942759d70241ab773127a",
      },
    });
    const categoryNews = response.data.articles;
    return res.json({
      message: `News Article for category ${category}`,
      news: categoryNews,
    });
  } catch (error) {
    console.log("Such type of category not found ", error);
    return res.json({ message: "Category not found Internal server error" });
  }
};
