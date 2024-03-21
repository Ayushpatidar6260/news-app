import { Router } from "express";
import {
  newsController,
  login,
  userUpdates,
  Userdelete,
  searchNewsByType,
  getLatestNews,
  getNewsByCategory,
} from "../controller/controll.js";
const router = Router();
router.post("/Signup", newsController);
router.get("/login", login);
router.put("/Update/:id", userUpdates);
router.delete("/delete/:id", Userdelete);
router.get("/search/:id", searchNewsByType);
router.get("/latest", getLatestNews);
router.get("/category/:id", getNewsByCategory);

export default router;
