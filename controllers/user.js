// Importation de la connexion à la base de données
import { db } from "../connect.js";

// Importation de JWT pour gérer les tokens
import jwt from "jsonwebtoken";

// Fonction pour récupérer un utilisateur par son ID
export const getUser = (req, res) => {
  // Récupération de l'ID utilisateur depuis les paramètres de la requête
  const userId = req.params.userId;

  // Requête SQL pour récupérer l'utilisateur correspondant à l'ID
  const q = "SELECT * FROM users WHERE id=?";

  // Exécution de la requête avec l'ID utilisateur
  db.query(q, [userId], (err, data) => {
    // Gestion des erreurs lors de la requête
    if (err) return res.status(500).json(err);

    // Vérifie si les données récupérées contiennent un résultat
    if (!data || data.length === 0) {
      // Si l'utilisateur n'est pas trouvé, renvoie une erreur 404
      return res.status(404).json("Utilisateur non trouvé");
    }

    // Déstructuration pour exclure le mot de passe des données retournées
    const { password, ...info } = data[0];

    // Retourne les informations utilisateur sans le mot de passe
    return res.json(info);
  });
};

// Fonction pour mettre à jour les informations d'un utilisateur
export const updateUser = (req, res) => {
  // Récupère le token JWT depuis les cookies
  const token = req.cookies.accessToken;

  // Si aucun token n'est présent, renvoie une erreur 401 (Non authentifié)
  if (!token) return res.status(401).json("Non authentifié!");
  
  // Vérifie et décode le token JWT
  jwt.verify(token, "secretkey", (err, userInfo) => {
    // Si le token est invalide, renvoie une erreur 403 (Interdit)
    if (err) return res.status(403).json("Token invalide!");

    // Requête SQL pour mettre à jour les informations de l'utilisateur
    const q = "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePicture`=?, `coverPicture`=? WHERE id=?";

    // Les valeurs à mettre à jour dans la base de données
    const values = [
      req.body.name,           // Nom de l'utilisateur
      req.body.city,           // Ville de l'utilisateur
      req.body.website,        // Site web de l'utilisateur
      req.body.profilePicture, // Photo de profil de l'utilisateur
      req.body.coverPicture,   // Photo de couverture
      userInfo.id              // ID de l'utilisateur récupéré depuis le token JWT
    ];

    // Exécution de la requête SQL pour mettre à jour l'utilisateur
    db.query(q, values, (err, data) => {
      // Gestion des erreurs lors de la requête
      if (err) return res.status(500).json(err);

      // Vérifie si la mise à jour a été effectuée (affectedRows > 0)
      if (data.affectedRows > 0) {
        // Si la mise à jour a réussi, renvoie un message de succès
        return res.json("Mis à jour!");
      }

      // Si l'utilisateur essaie de mettre à jour un profil qui n'est pas le sien, renvoie une erreur 403
      return res.status(403).json("Vous ne pouvez mettre à jour que votre propre profil!");
    });
  });
};
