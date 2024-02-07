const NotesModal = require("../models/NotesModal");
const UserModel = require("../models/UserModel");

const jwt = require("jsonwebtoken");

const authenticationtoken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "tokenformateinvalid" });

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(404).json({ message: "invalidtoken" });
    }
    req.user = user;
    next();
  });
};

const getCheck = async (req, res) => {
  const getuser = await UserModel.find({ _id: req.user.id });
  if (getuser.length > 0) {
    return res.status(200).json({ message: "userfound" });
  } else {
    return res.status(404).json({ message: "usernotfound" });
  }
};

const getDashboard = async (req, res) => {
  const gettitle = await NotesModal.find({ userid: req.user.id });
  const reversedOrder = gettitle.reverse();
  res.status(200).json(reversedOrder);
};

const postNewNote = async (req, res) => {
  const { title, content, timestamp } = req.body;
  try {
    const gettitle = await NotesModal.find({ title: title });
    if (gettitle.length > 0) {
      const userid = await NotesModal.find({
        title: title,
        userid: req.user.id,
      });
      if (userid.length > 0) {
        return res.status(200).json({ message: "titlealreadyexits" });
      } else {
        NotesModal.create({
          userid: req.user.id,
          title: title,
          content: content,
          timestamp: timestamp,
        });
        return res.status(201).json({ message: "noteadded" });
      }
    } else {
      NotesModal.create({
        userid: req.user.id,
        title: title,
        content: content,
        timestamp: timestamp,
      });
      return res.status(201).json({ message: "noteadded" });
    }
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const postUpdateTitle = async (req, res) => {
  try {
    const { noteid, title } = req.body;

    const gettitle = await NotesModal.find({ title: title });
    if (gettitle.length > 0) {
      const userid = await NotesModal.find({
        title: title,
        userid: req.user.id,
      });
      if (userid.length > 0) {
        return res.status(200).json({ message: "titlealreadyexits" });
      } else {
        const getnoteid = await NotesModal.find({ _id: noteid });
        if (getnoteid.length > 0 && title.length > 0) {
          const titleupdate = await NotesModal.findOneAndUpdate(
            { _id: noteid },
            {
              title: title,
            }
          );

          if (titleupdate) {
            return res.status(200).json({ message: "notetitleupdated" });
          } else {
            return res.status(200).json({ message: "failed" });
          }
        } else {
          return res.status(404).json({ message: "checkid&title" });
        }
      }
    } else {
      const getnoteid = await NotesModal.find({ _id: noteid });
      if (getnoteid.length > 0 && title.length > 0) {
        const titleupdate = await NotesModal.findOneAndUpdate(
          { _id: noteid },
          {
            title: title,
          }
        );

        if (titleupdate) {
          return res.status(200).json({ message: "notetitleupdated" });
        } else {
          return res.status(200).json({ message: "failed" });
        }
      } else {
        return res.status(404).json({ message: "checkid&title" });
      }
    }
  } catch (err) {
    return res.status(404).json({ message: "checkbody" });
  }
};

const postUpdateContent = async (req, res) => {
  try {
    const { noteid, content } = req.body;
    const getnoteid = await NotesModal.find({ _id: noteid });
    if (getnoteid.length > 0 && content.length > 0) {
      const contentupdate = await NotesModal.findOneAndUpdate(
        { _id: noteid },
        {
          content: content,
        }
      );

      if (contentupdate) {
        return res.status(200).json({ message: "notecontentupdated" });
      } else {
        return res.status(200).json({ message: "failed" });
      }
    } else {
      return res.status(404).json({ message: "checkid&content" });
    }
  } catch (err) {
    return res.status(404).json({ message: "checkbodycontent" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteid } = req.body;
    const getnoteid = await NotesModal.find({ _id: noteid });
    if (getnoteid.length > 0) {
      const deleteNote = await NotesModal.findOneAndDelete({ _id: noteid });

      if (deleteNote) {
        return res.status(200).json({ message: "notedeleted" });
      } else {
        return res.status(200).json({ message: "failed" });
      }
    } else {
      return res.status(404).json({ message: "idnotfound" });
    }
  } catch (err) {
    return res.status(404).json({ message: "checkbody" });
  }
};

module.exports = {
  authenticationtoken,
  getCheck,
  getDashboard,
  postNewNote,
  postUpdateTitle,
  postUpdateContent,
  deleteNote,
};
