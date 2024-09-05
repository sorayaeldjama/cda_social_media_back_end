
import { db } from "../connect.js";
import jwt from "jsonwebtoken";



export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);

    // Vérifie si `data` contient des résultats
    if (!data || data.length === 0) {
      return res.status(404).json("Utilisateur non trouvé");
    }

    // Déstructuration avec vérification
    const { password, ...info } = data[0];
    return res.json(info);
  });
};



export const updateUser = (req, res) => {
  const token = req.cookies.accessToken; 
  if (!token) return res.status(401).json("Non authentifié!");
  
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token invalide!");
    
    const q = "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePicture`=?, `coverPicture`=? WHERE id=?";
    const values = [
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.profilePicture, // Chemin vers la photo de profil
      req.body.coverPicture,
      userInfo.id
    ];
    
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.affectedRows > 0) {
        return res.json("Mis à jour!");
      }

      return res.status(403).json("Vous ne pouvez mettre à jour que votre propre profil!");
    });
  });
};
