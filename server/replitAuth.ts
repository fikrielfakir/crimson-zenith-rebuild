import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { db, pool } from "./db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const PgSession = connectPgSimple(session);

  const sessionStore = new PgSession({
    pool: pool as any,
    tableName: "sessions",
    createTableIfMissing: false,
  });

  return session({
    secret: process.env.SESSION_SECRET || "default-secret-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          const userResults = await db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

          if (userResults.length === 0) {
            return done(null, false, { message: "Invalid username or password" });
          }

          const user = userResults[0];

          if (!user.password) {
            return done(null, false, { message: "Invalid username or password" });
          }

          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            return done(null, false, { message: "Invalid username or password" });
          }

          const { password: _, ...userWithoutPassword } = user;
          return done(null, userWithoutPassword);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser(async (id: string, cb) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return cb(null, false);
      }
      cb(null, user);
    } catch (error) {
      cb(error);
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const { firstName, lastName, email, password, confirmPassword } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email address" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      if (confirmPassword && password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.username, email))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await db.insert(users).values({
        id,
        username: email,
        email,
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        password: hashedPassword,
        role: "user",
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return res.status(201).json({
        message: "Account created successfully",
        user: { id, email, firstName, lastName, role: "user" },
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login error" });
        }
        return res.json({
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            role: user.role || "user",
          },
        });
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout error" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Get current user endpoint
  app.get("/api/user", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
        role: user.role || "user",
        profileImageUrl: user.profileImageUrl,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        interests: user.interests,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get current user endpoint (legacy support)
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
        role: user.role || "user",
        profileImageUrl: user.profileImageUrl,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        interests: user.interests,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile endpoint
  app.put("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, phone, location, bio, interests, profileImageUrl } = req.body;

      const updateData: any = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (phone !== undefined) updateData.phone = phone;
      if (location !== undefined) updateData.location = location;
      if (bio !== undefined) updateData.bio = bio;
      if (interests !== undefined) updateData.interests = interests;
      if (profileImageUrl !== undefined) updateData.profileImageUrl = profileImageUrl;
      updateData.updatedAt = new Date();

      await db.update(users).set(updateData).where(eq(users.id, userId));

      const updatedUser = await storage.getUser(userId);

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Change password endpoint
  app.post("/api/auth/change-password", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      const [userWithPass] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!userWithPass || !userWithPass.password) {
        return res.status(400).json({ message: "Cannot change password for this account" });
      }

      const isValid = await bcrypt.compare(currentPassword, userWithPass.password);
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.update(users).set({ password: hashedPassword, updatedAt: new Date() }).where(eq(users.id, userId));

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Upload profile image endpoint
  app.post("/api/auth/upload-profile-image", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { imageData } = req.body;

      if (!imageData) {
        return res.status(400).json({ message: "No image data provided" });
      }

      const matches = imageData.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ message: "Invalid image format" });
      }

      await db.update(users).set({
        profileImageUrl: imageData,
        updatedAt: new Date(),
      }).where(eq(users.id, userId));

      const updatedUser = await storage.getUser(userId);

      res.json({
        message: "Profile image updated successfully",
        profileImageUrl: imageData,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      res.status(500).json({ message: "Failed to upload profile image" });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};

export const isAdmin: RequestHandler = async (req: any, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  return next();
};
