const express = require("express");

const { postUser, postLogin } = require("../controllers/UserControllers");

const {
  authenticationtoken,
  getCheck,
  getDashboard,
  postNewNote,
  postUpdateTitle,
  postUpdateContent,
  deleteNote
} = require("../controllers/DashboardControllers");

const routes = express.Router();

routes.post("/register", postUser);

routes.post("/login", postLogin);

routes.get("/check", authenticationtoken, getCheck);

routes.get("/dashboard", authenticationtoken, getDashboard);

routes.post("/dashboard", authenticationtoken, postNewNote);

routes.patch("/dashboard/updatetitle", authenticationtoken, postUpdateTitle);

routes.patch("/dashboard/updatecontent", authenticationtoken, postUpdateContent);

routes.delete("/dashboard/deletenote", authenticationtoken, deleteNote);

module.exports = routes;
