import { db } from "../connect.js"; // Assurez-vous que le chemin d'accès est correct
import jwt from "jsonwebtoken";
import {  deleteRelationshipDao,getRelationshipsDao } from '../dao/relationshipsDao.js'; // Importation du DAO

// Route pour récupérer les utilisateurs qui suivent un utilisateur donné
export const getRelationships = (req, res) => {
  const userId = req.query.userId; // Assurez-vous que l'ID de l'utilisateur est bien passé

  getRelationshipsDao(userId, (err, data) => {
    if (err) {
      return res.status(500).json(err); // Renvoie l'erreur reçue du DAO
    }
    return res.status(200).json(data.map(relationship => relationship.followedUserId)); // Renvoie les IDs des utilisateurs suivis
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

    const userId = req.query.userId;
    
    deleteRelationshipDao(userInfo.id, userId, (err, result) => {
      if (err) {
        return res.status(500).json(err); // Renvoie l'erreur reçue du DAO
      }
      return res.status(200).json(result); // Renvoie le résultat reçu du DAO
    });
  });
};