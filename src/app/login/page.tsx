"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

type Mode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter();

  // 如果已登录，重定向到首页
  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let result;

      if (mode === "login") {
        result = await login(email, password);
      } else {
        if (!name.trim()) {
          setError("请输入用户名");
          return;
        }
        result = await register(email, password, name);
      }

      if (result.success) {
        setSuccess(mode === "login" ? "登录成功！" : "注册成功！");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setError(result.error || "操作失败");
      }
    } catch (err) {
      setError("发生错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl">
            <span style={{ color: "var(--accent-blue)" }}>观点交易所</span>
          </Link>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            {mode === "login" ? "登录你的账户" : "创建新账户"}
          </p>
        </div>

        <div
          className="p-6 rounded-2xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          {/* 模式切换 */}
          <div className="flex mb-6 p-1 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
            <button
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === "login" ? "btn-primary" : ""
              }`}
              style={mode !== "login" ? { color: "var(--text-secondary)" } : {}}
            >
              登录
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === "register" ? "btn-primary" : ""
              }`}
              style={mode !== "register" ? { color: "var(--text-secondary)" } : {}}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 注册时显示用户名字段 */}
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                  用户名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入用户名"
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="输入邮箱地址"
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
                disabled={loading}
                required
                minLength={6}
              />
              <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                {mode === "login" ? (
                  <span>测试账号: demo@example.com / demo123</span>
                ) : (
                  <span>密码至少 6 位</span>
                )}
              </p>
            </div>

            {/* 错误提示 */}
            {error && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{ background: "#fef0f0", color: "var(--accent-red)" }}
              >
                {error}
              </div>
            )}

            {/* 成功提示 */}
            {success && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{ background: "#f0f9eb", color: "var(--accent-green)" }}
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full btn btn-primary py-3"
              disabled={loading}
            >
              {loading ? "处理中..." : (mode === "login" ? "登录" : "注册")}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "var(--text-secondary)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--accent-blue)" }}>
            ← 返回首页
          </Link>
        </p>
      </div>
    </div>
  );
}
