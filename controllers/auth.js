import { db } from "../connect.js"; // Importation de la connexion à la base de données
import bcrypt from "bcryptjs"; // Importation de la bibliothèque pour le hachage des mots de passe
import jwt from "jsonwebtoken"; // Importation de la bibliothèque pour la création et la gestion des tokens JWT

// Fonction pour enregistrer un nouvel utilisateur
export const register = (req, res) => {

    // Vérification si l'utilisateur existe déjà dans la base de données
    const q = "SELECT * FROM users WHERE username = ?";
    
    // Exécution de la requête pour vérifier l'existence du nom d'utilisateur
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err); // Si une erreur survient lors de la requête, renvoyer une réponse 500
        if (data.length) return res.status(409).json("Cet utilisateur existe déjà!"); // Si l'utilisateur existe, retourner une réponse 409 (conflit)

        // Si l'utilisateur n'existe pas, on peut le créer
        // Générer un salt pour hacher le mot de passe
        const salt = bcrypt.genSaltSync(10);
        // Hacher le mot de passe avec le salt généré
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        
        // Requête SQL pour insérer le nouvel utilisateur dans la base de données
        const q = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";
        const values = [
            req.body.username,  // Nom d'utilisateur fourni dans la requête
            req.body.email,     // Email fourni
            hashedPassword,     // Mot de passe haché
            req.body.name       // Nom complet fourni
        ];

        // Exécution de la requête pour insérer les valeurs dans la base de données
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err); // Si une erreur survient lors de l'insertion, renvoyer une réponse 500
            return res.status(200).json("User has been created."); // Si tout est correct, renvoyer une réponse 200 (succès)
        });
    });
};


// Fonction pour connecter un utilisateur
export const login = (req, res) => {
    // Requête SQL pour vérifier si l'utilisateur avec le nom d'utilisateur donné existe
    const q = "SELECT * FROM users WHERE username = ?";
    
    // Exécution de la requête pour récupérer les informations de l'utilisateur
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err); // Si une erreur survient lors de la requête, renvoyer une réponse 500
        if (data.length === 0) return res.status(404).json("Cet utilisateur n'existe pas!"); // Si l'utilisateur n'existe pas, renvoyer une réponse 404

        // Comparer le mot de passe fourni avec celui stocké dans la base de données (haché)
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if (!checkPassword) return res.status(400).json("Mot de passe ou nom d'utilisateur incorrect!"); // Si le mot de passe est incorrect, renvoyer une réponse 400

        // Si le mot de passe est correct, générer un token JWT
        const token = jwt.sign(
            {
                id: data[0].id,              // ID de l'utilisateur
                username: data[0].username,   // Nom d'utilisateur
                email: data[0].email,         // Email de l'utilisateur
                city: data[0].city,           // Ville (optionnel)
                coverPicture: data[0].coverPicture,   // Photo de couverture (optionnel)
                profilePicture: data[0].profilePicture // Photo de profil (optionnel)
            },
            "secretkey", // Clé secrète pour signer le token (à mettre dans une variable d'environnement pour plus de sécurité)
            { expiresIn: '1h' } // Le token expire dans 1 heure
        );

        // On exclut le mot de passe des données à renvoyer au client pour plus de sécurité
        const { password, ...others } = data[0];

        // Envoi du token dans un cookie avec l'option `httpOnly` pour empêcher l'accès au cookie depuis le client JavaScript
        res.cookie("accessToken", token, {
            httpOnly: true, // Le cookie ne sera accessible qu'à partir du serveur
        })
        .status(200) // Succès
        .json(others); // Renvoyer les informations de l'utilisateur sans le mot de passe
    });
};


// Fonction pour déconnecter un utilisateur
export const logout = (req, res) => {
    // Supprimer le cookie contenant le token JWT pour déconnecter l'utilisateur
    res.clearCookie("accessToken", {
        secure: false, // Option à activer si le site est en HTTPS (false ici pour le développement local)
        sameSite: "none" // Définit les règles sur l'envoi du cookie dans les requêtes cross-site (ici, `none` permet d'envoyer le cookie)
    })
    .status(200) // Succès
    .json("L'utilisateur est deconnecté."); // Confirmation de la déconnexion
};
