const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res) => {
  try {
    const { email, password, fullName, studentId, phone, role } = req.body;

    if (!email || !password || !fullName) {
      return errorResponse(res, 'Email, password, and full name are required.', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters long.', 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists.', 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        fullName: fullName.trim(),
        studentId: studentId ? studentId.trim() : null,
        phone: phone ? phone.trim() : null,
        role: role === 'SECURITY_STAFF' ? 'SECURITY_STAFF' : 'STUDENT',
        isVerified: true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        studentId: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Log the registration event into AuditLog
    await prisma.auditLog.create({
      data: {
        performedBy: newUser.id,
        action: 'USER_REGISTER',
        metadata: {
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
        },
      },
    }).catch(err => console.error('AuditLog error:', err.message));

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return successResponse(
      res,
      'Registration successful!',
      { user: newUser, token },
      201
    );
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(res, 'Failed to register user.', 500, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required.', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return errorResponse(res, 'Invalid email or password credentials.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password credentials.', 401);
    }

    // Record login activity in AuditLog
    await prisma.auditLog.create({
      data: {
        performedBy: user.id,
        action: 'USER_LOGIN',
        metadata: {
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
        },
      },
    }).catch(err => console.error('AuditLog error:', err.message));

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      studentId: user.studentId,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };

    return successResponse(res, 'Login successful!', { user: safeUser, token });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Failed to login.', 500, error.message);
  }
};

const getMe = async (req, res) => {
  try {
    const userWithStats = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        studentId: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            items: true,
            claims: true,
          },
        },
      },
    });

    return successResponse(res, 'Profile retrieved successfully.', userWithStats);
  } catch (error) {
    console.error('getMe error:', error);
    return errorResponse(res, 'Failed to fetch user profile.', 500, error.message);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
