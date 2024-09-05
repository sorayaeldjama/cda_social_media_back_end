import { db } from "../connect.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    //CHECK USER IF EXISTS

    const q = "SELECT * FROM users WHERE username = ?";
    console.log("requete je suis dans  avant le register",req)

    db.query(q, [req.body.username], (err, data) => {
        console.log("requete",req.body)
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("Cet utilisateur existe deja!");
      //Creer un nouveau utilisateur
      //Hasher le mot de passe
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      const q =
        "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";
  
      const values = [
        req.body.username,
        req.body.email,
        hashedPassword,
        req.body.name,
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created.");
      });
    });
  };
export const login= (req,res)=>{
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) =>{
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("Cet utilisateur n'existe pas!");
    
        const checkPassword = bcrypt.compareSync(
          req.body.password,
          data[0].password
        );
        if (!checkPassword)
            return res.status(400).json("Wrong password or username!");
      
        const token = jwt.sign(
          { id: data[0].id,
            username: data[0].username,
            email:data[0].email,
            city:data[0].city,
            coverPicture:data[0].coverPicture,
            profilePicture:data[0].profilePicture




           }, "secretkey",{expiresIn :'1h'});
        const { password, ...others } = data[0];

        res
      .cookie("accessToken", token, {
        httpOnly: true,
        // sameSite: 'Lax', 
      })
      .status(200)
      .json(others);
  });

}

export const logout = (req, res) => {
    res.clearCookie("accessToken",{
      secure:false,
      sameSite:"none"
    }).status(200).json("User has been logged out.")
  };