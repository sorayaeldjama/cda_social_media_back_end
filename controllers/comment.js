import { db } from "../connect.js";  // Importation de la connexion à la base de données
import jwt from "jsonwebtoken";  // Importation de la bibliothèque pour la gestion des tokens JWT
import moment from "moment";  // Importation de la bibliothèque Moment.js pour manipuler les dates

// Fonction pour récupérer les commentaires associés à un post
export const getComments = (req, res) => {
    // Requête SQL pour sélectionner les commentaires et les informations des utilisateurs
    const q = `
      SELECT c.*, u.id AS userId, name, profilePicture 
      FROM comments AS c 
      JOIN users AS u ON (u.id = c.comment_uuid) 
      WHERE c.comment_post_id = ? 
      ORDER BY c.created_at DESC
    `;
    
    // Exécution de la requête SQL en passant l'ID du post récupéré via la requête
    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);  // Si une erreur survient, renvoyer une réponse 500 (erreur serveur)
      return res.status(200).json(data);  // Si tout va bien, renvoyer les commentaires sous forme de JSON
    });
};

// Fonction pour ajouter un commentaire à un post
export const addComment = (req, res) => {
    // Récupérer le token JWT depuis les cookies du client
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");  // Si le token est manquant, renvoyer une réponse 401 (non autorisé)

    // Vérifier la validité du token
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");  // Si le token est invalide, renvoyer une réponse 403 (interdit)

        // Si le token est valide, préparer l'insertion du commentaire dans la base de données
        const q = "INSERT INTO comments(`description`, `created_at`, `comment_uuid`, `comment_post_id`) VALUES (?)";
        
        // Définir les valeurs à insérer : description du commentaire, date de création, ID de l'utilisateur, ID du post
        const values = [
            req.body.description,  // Description du commentaire passée dans le corps de la requête
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),  // Date actuelle formatée avec Moment.js
            userInfo.id,  // ID de l'utilisateur récupéré depuis le token JWT
            req.body.postId  // ID du post auquel le commentaire est associé, passé dans le corps de la requête
        ];

        // Exécuter la requête SQL pour insérer le commentaire
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);  // Si une erreur survient, renvoyer une réponse 500 (erreur serveur)
            return res.status(200).json("Comment has been created.");  // Si tout va bien, renvoyer un message de succès
        });
    });
};
