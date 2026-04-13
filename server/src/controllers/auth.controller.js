import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
      roles: "user",
    });

    const user = await User.findById(userId);

    res.status(201).json({
      message: "Compte créé avec succès",
      user,
    });
  } catch (error) {
    console.error("Erreur register :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error("Erreur login :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getMe = async (req, res) => {
  try {
    console.log("GET /me req.user =", req.user);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Erreur getMe :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateMe = async (req, res) => {
  try {
    console.log("PUT /me req.user =", req.user);
    console.log("PUT /me req.body =", req.body);

    const { nom, prenom, email } = req.body;

    if (!nom || !prenom || !email) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const existingUser = await User.findByEmail(email);
    console.log("PUT /me existingUser =", existingUser);

    if (existingUser && Number(existingUser.id) !== Number(req.user.id)) {
      return res.status(409).json({ error: "Cet email est déjà utilisé" });
    }

    const updatedUser = await User.updateProfile(req.user.id, {
      nom,
      prenom,
      email,
    });

    console.log("PUT /me updatedUser =", updatedUser);

    return res.json({
      message: "Profil mis à jour",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur updateMe :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

