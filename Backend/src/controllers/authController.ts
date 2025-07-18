import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { sendMail } from '../utils/mail';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// In-memory OTP store (for demo; use Redis or DB in production)
const otpStore = new Map<string, { otp: string; expires: number; userData: any }>();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, contact, password, addresses } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, {
      otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 min
      userData: { name, email, contact, password, addresses },
    });
    // Send OTP email
    await sendMail(
      email,
      'Your Registration OTP',
      `<h2>Hi ${name},</h2><p>Your OTP for registration is: <b>${otp}</b>. It is valid for 10 minutes.</p>`
    );
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to send OTP', details: err });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const entry = otpStore.get(email);
    if (!entry || entry.otp !== otp || entry.expires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    // Create user
    const { name, contact, password, addresses } = entry.userData;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, contact, password: hashed, addresses });
    await user.save();
    otpStore.delete(email);
    // Send welcome email
    await sendMail(
      email,
      'Welcome to our e-commerce platform',
      `<h2>Hi ${name},</h2><p>Your registration is complete. Thank you for joining us!</p>`
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'OTP verification failed', details: err });
  }
};

// Forgot password endpoint
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 min
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    // Send reset email
    await sendMail(
      email,
      'Password Reset Request',
      `<h2>Password Reset</h2><p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 30 minutes.</p>`
    );
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send password reset email', details: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: 'Login failed', details: err });
  }
};

// Reset password endpoint
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset password', details: err });
  }
};