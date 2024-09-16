import { db } from '../connect.js'; // Importation de la connexion à la base de données



// Fonction pour récupérer les utilisateurs qui suivent un utilisateur donné
export const getRelationshipsDao = (userId, callback) => {
    const q = "SELECT followedUserId FROM relationships WHERE followerUserId = ?";
  
    db.query(q, [userId], (err, data) => {
      if (err) {
        console.error('Erreur lors de la récupération des relations:', err);
        return callback(err, null); // Passe l'erreur au callback
      }
      return callback(null, data); // Passe les données au callback
    });
  };
// Fonction pour supprimer une relation de suivi
export const deleteRelationshipDao = (followerUserId, followedUserId, callback) => {
  const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
  
  db.query(q, [followerUserId, followedUserId], (err, data) => {
    if (err) {
      console.error('Erreur lors de la suppression de la relation:', err);
      return callback(err, null); // Passe l'erreur au callback
    }
    return callback(null, "Unfollow"); // Passe le résultat au callback
  });
};
