
import jwt from "jsonwebtoken";
import { db } from "../connect.js";

// Fonction pour obtenir tous les utilisateurs sauf l'utilisateur actuel
export const getAllUsersExceptCurrent = (req, res) => {
  // Récupère le token d'accès depuis les cookies
  const token = req.cookies.accessToken;

  // Si le token n'existe pas, l'utilisateur n'est pas connecté
  if (!token) {
    console.error("Aucun token trouvé dans les cookies.");
    return res.status(401).json("Not logged in!");
  }

  // Vérifie le token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.error("Le token n'est pas valide ou a expiré:", err);
      return res.status(403).json("Token is not valid!");
    }

    // Log de userInfo pour s'assurer qu'il est défini
    console.log("userInfo décrypté du token:", userInfo);

    // Requête SQL pour récupérer tous les utilisateurs sauf l'utilisateur actuel
    const q = "SELECT * FROM users WHERE id != ?";
    const values = [userInfo.id];

    // Exécute la requête SQL
    db.query(q, (values), (err, data) => {
      if (err) {
        console.error("Erreur lors de l'exécution de la requête SQL:", err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
      }

      console.log("Résultats de la requête:", data);
      return res.status(200).json(data);
    });
  });
};
