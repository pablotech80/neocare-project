import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('[LOGIN] Iniciando proceso de login');
    console.log('[LOGIN] Email:', email);

    try {
      console.log('[LOGIN] Llamando a función login...');
      const response = await login({ email, password });
      console.log('[LOGIN] Login exitoso, respuesta:', response);
      console.log('[LOGIN] Guardando token en localStorage...');
      setToken(response.access_token);
      console.log('[LOGIN] Navegando a dashboard...');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('[LOGIN] Error capturado:', err);
      console.error('[LOGIN] Error response:', err.response);
      console.error('[LOGIN] Error data:', err.response?.data);
      const errorMsg = err.response?.data?.detail || 'Error al iniciar sesión';
      console.error('[LOGIN] Mensaje de error:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
      console.log('[LOGIN] Proceso de login terminado');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efectos de niebla */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 border border-purple-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Bienvenido a NeoCare</h1>
          <p className="text-gray-600 mt-2">Inicia sesión para continuar</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-2.5 rounded-lg font-medium hover:from-purple-700 hover:to-violet-700 focus:ring-4 focus:ring-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Iniciando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-purple-600 font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
