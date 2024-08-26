import { body, validationResult } from 'express-validator';

// Middleware de validation pour la création d'un post
export const validatePostData = [
  body('description')
    .notEmpty()
    .withMessage('Description is required.')
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters.'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Image URL must be valid if provided.'),
  
  // Vérification des erreurs de validation
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


export const checkPostOwnership = async (req, res, next) => {
  const token = req.cookies.accessToken;
  const postId = req.params.id;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const post = await Post.findByPk(postId);

      if (!post) return res.status(404).json("Post not found");

      if (post.userId !== userInfo.id) {
        return res.status(403).json("You can only delete your own posts");
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  });
};
