import jwt from "jsonwebtoken"; // Importation de JWT pour gérer les tokens
import { db } from "../connect.js"; // Importation de la connexion à la base de données
import moment from "moment"; // Importation de moment pour gérer les dates

// Fonction pour récupérer les posts
export const getPosts = (req, res) => {
  // Récupère l'ID utilisateur depuis les paramètres de la requête
  const userId = req.query.userId;

  // Récupère le token JWT depuis les cookies
  const token = req.cookies.accessToken;
  console.log("token ", token); // Log pour déboguer le token
  console.log("userId", userId); // Log pour déboguer l'ID utilisateur

  // Vérification si le token existe, sinon renvoie une erreur 401 (non connecté)
  if (!token) {
    console.error("Aucun token trouvé dans les cookies.");
    return res.status(401).json("Not logged in!");
  }

  // Vérification et décryptage du token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.error("Le token n'est pas valide ou a expiré:", err);
      return res.status(403).json("Token is not valid!"); // Renvoie une erreur 403 si le token n'est pas valide
    }

    // Log pour s'assurer que userInfo a bien été décrypté
    console.log("userInfo décrypté du token:", userInfo);

    // Construction de la requête SQL en fonction de la présence d'un userId
    const q = userId !== "undefined" ?
      `SELECT p.*, u.id AS userId, name, profilePicture
       FROM posts AS p
       JOIN users AS u ON (u.id = p.userId)
       WHERE p.userId = ? ORDER BY p.created_at DESC`
      :
      `SELECT p.*, u.id AS userId, name, profilePicture
       FROM posts AS p
       JOIN users AS u ON (u.id = p.userId)
       LEFT JOIN relationships AS r ON (p.userId = r.followedUserId)
       WHERE r.followerUserId = ? OR p.userId = ?
       ORDER BY p.created_at DESC`;

    // Définition des valeurs pour la requête en fonction de la présence d'un userId
    const values = userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    // Exécution de la requête SQL
    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Erreur lors de l'exécution de la requête SQL:", err);
        return res.status(500).json({ error: "Erreur interne du serveur" }); // Renvoie une erreur 500 en cas de problème avec la requête SQL
      }

      console.log("Résultats de la requête:", data); // Log des résultats pour le débogage
      return res.status(200).json(data); // Retourne les données récupérées (les posts)
    });
  });
};

// Fonction pour ajouter un post
export const addPost = (req, res) => {
  // Récupère le token JWT depuis les cookies
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); // Si aucun token, renvoie une erreur 401 (non connecté)

  // Vérification et décryptage du token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); // Si le token est invalide, renvoie une erreur 403

    // Requête SQL pour insérer un nouveau post
    const q = "INSERT INTO posts(`description`, `image`, `created_at`, `userId`) VALUES (?)";
    
    // Valeurs à insérer dans la base de données (description, image, date actuelle et ID utilisateur)
    const values = [
      req.body.description, // Description du post récupérée depuis le corps de la requête
      req.body.image,       // Image associée au post
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), // Date actuelle formatée
      userInfo.id,          // ID de l'utilisateur récupéré à partir du token
    ];

    // Exécution de la requête SQL pour ajouter le post
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err); // Si une erreur survient, renvoie une erreur 500
      return res.status(200).json("Post has been created."); // Renvoie un message de succès
    });
  });
};

// Fonction pour supprimer un post
export const deletePost = (req, res) => {
  // Récupère le token JWT depuis les cookies
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); // Si aucun token, renvoie une erreur 401 (non connecté)

  // Vérification et décryptage du token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); // Si le token est invalide, renvoie une erreur 403

    // Requête SQL pour supprimer un post si l'utilisateur est propriétaire du post
    const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

    // Exécution de la requête SQL avec l'ID du post et l'ID de l'utilisateur
    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err); // Si une erreur survient, renvoie une erreur 500
      if (data.affectedRows > 0) return res.status(200).json("Post has been deleted."); // Si la suppression a réussi, renvoie un message de succès
      return res.status(403).json("You can delete only your post"); // Si l'utilisateur n'est pas propriétaire du post, renvoie une erreur 403
    });
  });
};
