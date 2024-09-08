import { db } from "../connect.js"; // Importation de la connexion à la base de données
import jwt from "jsonwebtoken"; // Importation de JSON Web Token pour l'authentification

// Fonction pour obtenir les likes d'un post
export const getLikes = (req, res) => {
  // Requête SQL pour sélectionner tous les `likeUserId` qui ont liké un post donné
  const q = "SELECT likeUserId FROM likes WHERE likePostsId = ?";

  // Exécution de la requête avec l'ID du post passé dans les paramètres de la requête
  db.query(q, [req.query.likePostsId], (err, data) => {
    if (err) return res.status(500).json(err); // Gestion des erreurs en cas d'échec de la requête
    console.log("data api ", data); // Affichage des données pour le débogage
    return res.status(200).json(data.map(like => like.likeUserId)); 
    // Retourne un tableau contenant les IDs des utilisateurs ayant liké le post
  });
};

// Fonction pour ajouter un like à un post
export const addLike = (req, res) => {
  console.log("works addlike res", res); // Affichage de la réponse pour le débogage

  // Récupération du token JWT à partir des cookies
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); 
  // Si le token n'existe pas, renvoie une erreur 401 (non connecté)

  // Vérification du token JWT
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); 
    // Si le token est invalide, renvoie une erreur 403 (interdit)

    // Requête SQL pour insérer un nouveau like dans la base de données
    const q = "INSERT INTO likes (`likeUserId`, `likePostsId`) VALUES ?";
    const values = [[userInfo.id, req.body.postId]]; // Utilisation des valeurs à insérer

    // Exécution de la requête d'insertion
    db.query(q, [values], (err, data) => {
      if (err) {
        console.error("SQL Error: ", err); // Affichage de l'erreur SQL pour le débogage
        return res.status(500).json(err); // Renvoie une erreur 500 en cas d'échec
      }
      return res.status(200).json("Post has been liked."); 
      // Si tout est bon, renvoie un message de succès
    });
  });
};

// Fonction pour supprimer un like d'un post
export const deleteLike = (req, res) => {
  console.log("works res", res); // Affichage de la réponse pour le débogage

  // Récupération du token JWT à partir des cookies
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); 
  // Si le token n'existe pas, renvoie une erreur 401 (non connecté)

  // Vérification du token JWT
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); 
    // Si le token est invalide, renvoie une erreur 403 (interdit)

    // Requête SQL pour supprimer un like d'un utilisateur pour un post spécifique
    const q = "DELETE FROM likes WHERE `likeUserId` = ? AND `likePostsId` = ?";

    // Exécution de la requête de suppression
    db.query(q, [userInfo.id, req.query.likePostsId], (err, data) => {
      if (err) {
        console.error("SQL Error: ", err); // Affichage de l'erreur SQL pour le débogage
        return res.status(500).json(err); // Renvoie une erreur 500 en cas d'échec
      }
      return res.status(200).json("Post has been disliked."); 
      // Si tout est bon, renvoie un message de succès
    });
  });
};
