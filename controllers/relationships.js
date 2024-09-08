import { db } from "../connect.js"; // Assurez-vous que le chemin d'accès est correct
import jwt from "jsonwebtoken";

// Route pour récupérer les utilisateurs qui suivent un utilisateur donné
export const getRelationships = (req, res) => {
  const userId = req.query.userId; // Assurez-vous que l'ID de l'utilisateur est bien passé
  console.log("userId pour getRelationships :", userId);
  
  const q = "SELECT followedUserId FROM relationships WHERE followerUserId = ?";
  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error('Erreur lors de la récupération des relations:', err);
      return res.status(500).json(err);
    }
    console.log('Données récupérées:', data);
    return res.status(200).json(data.map(relationship => relationship.followedUserId));
  });
};


export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.userId
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following");
    });
  });
};

// Route pour supprimer une relation de suivi
export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
    const userId = req.query.userId;

    db.query(q, [userInfo.id, userId], (err, data) => {
      if (err) {
        console.error('Erreur lors de la suppression de la relation:', err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Unfollow");
    });
  });
};