import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid Username or Password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rabuste-bg px-4">
      <div className="w-full max-w-md bg-rabuste-surface border border-rabuste-text/5 p-8 rounded-lg shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-rabuste-orange p-3 rounded-full mb-4 shadow-lg shadow-orange-600/20">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-rabuste-text tracking-wider">Admin Panel</h1>
          <p className="text-rabuste-muted text-sm mt-2 font-sans tracking-widest uppercase">Rabuste Coffee</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-rabuste-muted">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full bg-rabuste-bg border border-rabuste-text/10 rounded p-3 text-rabuste-text focus:outline-none focus:border-rabuste-gold transition-colors"
              placeholder="admin"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-rabuste-muted">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-rabuste-bg border border-rabuste-text/10 rounded p-3 text-rabuste-text focus:outline-none focus:border-rabuste-gold transition-colors"
              placeholder="••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-rabuste-orange hover:bg-rabuste-gold text-white font-bold py-3 rounded transition-all duration-300 uppercase tracking-widest text-sm shadow-lg hover:shadow-orange-500/20"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;