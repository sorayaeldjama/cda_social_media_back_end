import { db } from "../connect.js"
import jwt from "jsonwebtoken";
import moment from "moment";



export const getComments = (req, res) => {
    const q = `SELECT c.*, u.id AS userId, name, profilePicture FROM comments AS c JOIN users AS u ON (u.id = c.comment_uuid)
      WHERE c.comment_post_id = ? ORDER BY c.created_at DESC
      `;
  
    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  };
  
  export const addComment = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q = "INSERT INTO comments(`description`, `created_at`, `comment_uuid`, `comment_post_id`) VALUES (?)";
      const values = [
        req.body.description,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id,
        req.body.postId
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Comment has been created.");
      });
    });
  };