// src/components/auth/RegisterForm.tsx
import Link from "next/link";
import { useState } from "react";

interface RegisterFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error?: string;
}

export const RegisterForm = ({ onSubmit, isLoading, error }: RegisterFormProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, email, password });
    };

    return (
        <div className="w-full max-w-[480px] bg-white p-8 lg:p-12 rounded-xl shadow-xl border border-slate-100">
            <div className="mb-8 text-center">
                <h1 className="text-slate-900 text-[32px] font-bold pb-2 font-display">Crear cuenta</h1>
                <p className="text-slate-600">Únete para gestionar tus viajes fácilmente.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="text-slate-900 text-sm font-semibold">Nombre completo</label>
                    <input
                        type="text"
                        className="rounded-lg border border-slate-200 h-14 p-4 focus:border-primary focus:outline-none transition-all text-slate-900"
                        placeholder="Ej. Juan Pérez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                </div>

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
                        placeholder="Crea una contraseña segura"
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
                    {isLoading ? "Registrando..." : "Registrarse"}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-slate-600">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};