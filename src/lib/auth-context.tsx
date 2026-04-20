"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser } from "./types";

// 简单的密码哈希（仅用于 Demo，生产环境请使用 bcrypt 或类似库）
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

// 生成随机头像
function generateAvatar(name: string): string {
  const emojis = ["😊", "😎", "🤓", "🧐", "😇", "🥳", "🤗", "😺", "🐱", "🦊", "🐼", "🐨"];
  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % emojis.length;
  return emojis[index];
}

// 预置测试用户
const initialUsers: AuthUser[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo 用户",
    avatar: "😊",
    passwordHash: simpleHash("demo123"),
    createdAt: new Date("2024-01-01").toISOString(),
    balance: 1580,
  },
  {
    id: "2",
    email: "test@example.com",
    name: "测试用户",
    avatar: "😎",
    passwordHash: simpleHash("test123"),
    createdAt: new Date("2024-01-15").toISOString(),
    balance: 2500,
  },
];

const STORAGE_KEY = "point_deal_users";
const AUTH_KEY = "point_deal_auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 从 localStorage 加载用户数据
  const loadUsers = (): AuthUser[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // 初始化存储
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  };

  // 保存用户列表
  const saveUsers = (users: AuthUser[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  };

  // 检查持久化的登录状态
  useEffect(() => {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      const { userId } = JSON.parse(authData);
      const users = loadUsers();
      const foundUser = users.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟

    const users = loadUsers();
    const passwordHash = simpleHash(password);
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash);

    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: foundUser.id }));
      return { success: true };
    }

    return { success: false, error: "邮箱或密码错误" };
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟

    const users = loadUsers();

    // 检查邮箱是否已存在
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "该邮箱已被注册" };
    }

    const newUser: AuthUser = {
      id: Date.now().toString(),
      email,
      name,
      avatar: generateAvatar(name),
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
      balance: 1000, // 新用户初始积分
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    // 自动登录
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: newUser.id }));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
