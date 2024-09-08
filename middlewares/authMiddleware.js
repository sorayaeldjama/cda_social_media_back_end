import jwt from 'jsonwebtoken';
import {logout}  from '../controllers/auth.js';

// export const authenticateToken = (req, res, next) => {
//   const token = req.cookies.accessToken;

// //   try{
// //     const user =jwt.verify(token,"secretkey");
// //     req.user=user;
// //     next();

// //   }catch(err){
// //     res.clearCookie("token");
// //     logout(req, res);
// //         return res.redirect("http://localhost:3000/login");
// //   }

//   if (!token) {
//     return res.status(401).json("Not logged in!");
//   }

//   jwt.verify(token, "secretkey", (err, userInfo) => {
//     if (err) {
//       res.clearCookie("token");

//       return res.status(403).json("Token is not valid!");
//     }

//     req.user = userInfo; // Attache les informations de l'utilisateur à la requête
//     next();
//   });
// };
export const authenticateToken = (req, res, next) => {
  // Récupère le token d'accès depuis les cookies
  const token = req.cookies.accessToken;
  
  // Vérifie si le token est absent
  if (!token) {
    // Si aucun token n'est trouvé, l'utilisateur n'est pas connecté
    return res.status(401).json("Not logged in!");
  }

  try {
    // Tente de vérifier et de décoder le token JWT avec la clé secrète "secretkey"
    const user = jwt.verify(token, "secretkey");

    // Si la vérification réussit, attache les informations utilisateur à l'objet `req`
    req.user = user;

    // Passe à l'étape suivante dans la chaîne d'exécution (middleware suivant ou route)
    next();
  } catch (err) {
    // Si une erreur survient (par exemple, si le token est invalide ou expiré),
    // on supprime le cookie contenant le token pour éviter des tentatives répétées avec un token non valide
    res.clearCookie("token");

    // Envoie une réponse 403 avec un message d'erreur indiquant que le token est invalide
    return res.status(403).json("Token is not valid!");
  }
};
