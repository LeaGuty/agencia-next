// src/components/auth/LoginForm.tsx
import Link from "next/link";
import { useState } from "react";

interface LoginFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error?: string;
}

export const LoginForm = ({ onSubmit, isLoading, error }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    const handleGitHubLogin = () => {
        // Leemos la variable de entorno
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        const redirectUri = "http://localhost:3000/auth/github/callback";
        
        if (!clientId) {
            alert("Error: Faltan las credenciales de GitHub (NEXT_PUBLIC_GITHUB_CLIENT_ID)");
            return;
        }

        // Redirigimos a GitHub
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email`;
    };

    return (
        <div className="w-full max-w-[480px] bg-white p-8 lg:p-12 rounded-xl shadow-xl border border-slate-100">
            <div className="mb-8 text-center">
                <h1 className="text-slate-900 text-[32px] font-bold pb-2 font-display">Bienvenido de nuevo</h1>
                <p className="text-slate-600">Ingresa tus credenciales para gestionar tus reservas.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="text-slate-900 text-sm font-semibold">Correo electrónico</label>
                    <input
                        type="email"
                        className="rounded-lg border border-slate-200 h-14 p-4 focus:border-primary focus:outline-none transition-all text-slate-900"
                        placeholder="nombre@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-slate-900 text-sm font-semibold">Contraseña</label>
                    <input
                        type="password"
                        className="rounded-lg border border-slate-200 h-14 p-4 focus:border-primary focus:outline-none transition-all text-slate-900"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 bg-primary text-white h-14 rounded-lg font-bold hover:bg-blue-600 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500">O continúa con</span>
                    </div>
                </div>

                {/* Botón de GitHub CORREGIDO */}
                <button
                    type="button"
                    onClick={handleGitHubLogin}
                    className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white h-14 rounded-lg font-semibold hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-slate-600">
                    ¿No tienes cuenta?{" "}
                    {/* Enlace CORREGIDO: Ahora apunta a /register */}
                    <Link href="/register" className="text-primary font-bold hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};