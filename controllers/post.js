import jwt from "jsonwebtoken";
import { db } from "../connect.js";
import moment from "moment";

export const getPosts = (req, res) => {
  // On récupère le access token depuis les cookies

  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  console.log("token ",token)
console.log("userId",userId)
  // Si le token n'existe pas, alors on n'est pas connecté
  if (!token) {
    console.error("Aucun token trouvé dans les cookies.");
    return res.status(401).json("Not logged in!");
  }

  // Vérification du token
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.error("Le token n'est pas valide ou a expiré:", err);
      return res.status(403).json("Token is not valid!");
    }

    // Log de userInfo pour s'assurer qu'il est défini
    console.log("userInfo décrypté du token:", userInfo);

    const q = userId !=="undefined" ?`
    SELECT p.*, u.id AS userId, name, profilePicture
    FROM posts AS p
    JOIN users AS u ON (u.id = p.userId) WHERE p.userId =? ORDER BY p.created_at DESC`
   :`SELECT p.*,u.id AS userId,name,profilePicture FROM posts AS p JOIN users AS u ON(u.id =p.userId) LEFT JOIN relationships
    AS r ON (p.userId = r.followedUserId)
    WHERE r.followerUserId= ? OR p.userId= ?
    ORDER BY p.created_at DESC`;


    
    
    const values =userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];
    // Exécution de la requête SQL avec `userInfo.id`
    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Erreur lors de l'exécution de la requête SQL:", err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
      }
      
      console.log("Résultats de la requête:", data);
      return res.status(200).json(data);
    });
  });
};


export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`description`, `image`, `created_at`, `userId`) VALUES (?)";
    const values = [
      req.body.description,
      req.body.image,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });}