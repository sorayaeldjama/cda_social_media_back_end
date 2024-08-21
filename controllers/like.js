import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req,res)=>{
    const q = "SELECT likeUserId FROM likes WHERE likePostsId = ?";

    db.query(q, [req.query.likePostsId], (err, data) => {
      if (err) return res.status(500).json(err);
      console.log("data api ",data)
      return res.status(200).json(data.map(like=>like.userId));

    });
}

export const addLike = (req, res) => {
  console.log("works addlike res",res)

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO likes (`likeUserId`,`likePostsId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.postId
    ];

    db.query(q, (values), (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been liked.");
    });
  });
};

export const deleteLike = (req, res) => {
console.log("works res",res)
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM likes WHERE `likeUserId` = ? AND `likePostsId` = ?";

    db.query(q, [userInfo.id, req.query.likePostsId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been disliked.");
    });
  });}

  
  
