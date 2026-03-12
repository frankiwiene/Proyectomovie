import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LoginModalProps {
  onClose: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name },
          },
        });
        if (error) throw error;
      }
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      // Traducir mensajes comunes de Supabase al español
      if (message.includes("Invalid login credentials")) {
        setError("Correo o contraseña incorrectos.");
      } else if (message.includes("User already registered")) {
        setError("Ya existe una cuenta con ese correo.");
      } else if (message.includes("Password should be at least")) {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (message.includes("Unable to validate email address")) {
        setError("El formato del correo no es válido.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full max-w-md rounded-lg bg-zinc-900 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-white/70 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="mb-6 text-2xl text-white">
          {isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-2 block text-sm text-white/70">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tu nombre"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-white/70 text-sm">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 py-3 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Cargando..."
              : isLogin
                ? "Iniciar sesión"
                : "Registrarse"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
