import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export const register = async (req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    res.json(user);
};

export const login = async (req, res) => {
    const { email, password, token } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Senha incorreta" });

    if (user.mfaEnabled) {
        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: "base32",
            token
        });
        if (!verified) return res.status(400).json({ message: "Token MFA inválido" });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token: jwtToken });
};

export const enableMFA = async (req, res) => {
    const user = await User.findById(req.user.id);

    const secret = speakeasy.generateSecret({
        name: "MeuApp (MFA)"
    });

    user.mfaSecret = secret.base32;
    user.mfaEnabled = true;
    await user.save();

    const qr = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
        message: "MFA ativado",
        qrCode: qr,
        secret: secret.base32
    });
};