import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
}

export function LoginModal({ onClose, onLogin, onRegister }: LoginModalProps) {
const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    setIsLoading(true);
    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onRegister(name, email, password);
      }
      onClose();
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="relative w-full max-w-md rounded-lg bg-zinc-900 p-8 shadow-xl text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-white/70 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <X size={24} />
          </button>
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl text-white mb-3">¡Revisa tu correo!</h2>
          <p className="text-white/60 mb-2">
            Te enviamos un enlace de confirmación a
          </p>
          <p className="text-purple-400 font-medium mb-6">{email}</p>
          <p className="text-white/50 text-sm mb-6">
            Haz click en el enlace del correo para activar tu cuenta. Luego podrás iniciar sesión normalmente.
          </p>
          <button
            onClick={() => { setRegistered(false); setIsLogin(true); }}
            className="w-full rounded-lg bg-purple-600 py-3 text-white transition-colors hover:bg-purple-700"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

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
            <label className="mb-2 block text-sm text-white/70">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-zinc-800 px-4 py-3 pr-12 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="mb-2 block text-sm text-white/70">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 pr-12 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-purple-600 py-3 text-white transition-colors hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Cargando..." : isLogin ? "Iniciar sesión" : "Registrarse"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setConfirmPassword(""); setShowPassword(false); setShowConfirm(false); }}
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
