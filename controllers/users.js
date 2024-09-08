// Importation de JWT pour gérer les tokens
import jwt from "jsonwebtoken";
// Importation de la connexion à la base de données
import { db } from "../connect.js";

// Fonction pour obtenir tous les utilisateurs sauf l'utilisateur actuel
export const getAllUsersExceptCurrent = (req, res) => {
  // Récupère le token JWT d'accès depuis les cookies
  const token = req.cookies.accessToken;

  // Si aucun token n'est trouvé dans les cookies, renvoie une erreur 401 (Non connecté)
  if (!token) {
    console.error("Aucun token trouvé dans les cookies."); // Log pour déboguer
    return res.status(401).json("Not logged in!"); // Retourne une erreur indiquant que l'utilisateur n'est pas connecté
  }

  // Vérification et décryptage du token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    // Si le token est invalide ou expiré, renvoie une erreur 403 (Token invalide)
    if (err) {
      console.error("Le token n'est pas valide ou a expiré:", err); // Log de l'erreur pour déboguer
      return res.status(403).json("Token is not valid!");
    }

    // Log pour vérifier que `userInfo` est bien décrypté
    console.log("userInfo décrypté du token:", userInfo);

    // Requête SQL pour récupérer tous les utilisateurs sauf l'utilisateur actuel (dont l'ID est contenu dans le token)
    const q = "SELECT * FROM users WHERE id != ?";
    const values = [userInfo.id]; // L'utilisateur actuel est exclu

    // Exécution de la requête SQL
    db.query(q, (values), (err, data) => {
      // Si une erreur survient lors de l'exécution de la requête SQL, renvoie une erreur 500 (Erreur interne du serveur)
      if (err) {
        console.error("Erreur lors de l'exécution de la requête SQL:", err); // Log de l'erreur pour déboguer
        return res.status(500).json({ error: "Erreur interne du serveur" });
      }

      // Log pour voir les résultats de la requête
      console.log("Résultats de la requête:", data);
      
      // Retourne les utilisateurs trouvés (excluant l'utilisateur actuel)
      return res.status(200).json(data);
    });
  });
};
