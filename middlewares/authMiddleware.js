import jwt from 'jsonwebtoken';
import {logout}  from '../controllers/auth.js';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;

//   try{
//     const user =jwt.verify(token,"secretkey");
//     req.user=user;
//     next();

//   }catch(err){
//     res.clearCookie("token");
//     logout(req, res);
//         return res.redirect("http://localhost:3000/login");
//   }

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      res.clearCookie("token");

      return res.status(403).json("Token is not valid!");
    }

    req.user = userInfo; // Attache les informations de l'utilisateur à la requête
    next();
  });
};
