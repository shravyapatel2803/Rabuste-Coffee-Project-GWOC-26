import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Coffee, Lock, Mail, Loader2, KeyRound } from "lucide-react"; 
import { forgotPasswordAPI } from "../api/auth"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false); 

  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result && result.success) {
      navigate("/");
    } else {
      setError(result?.message || "Invalid Credentials. Please try again.");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first to reset password.");
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to reset password for: ${email}?`
    );
    if (!isConfirmed) return;

    setResetLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await forgotPasswordAPI(email);

      if (res.data.success) {
        setSuccessMsg("Password sent to your login email! 📧");
        alert("Password sent to your login email!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rabuste-bg px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-rabuste-orange/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-rabuste-gold/10 rounded-full blur-[80px]" />

      <div className="w-full max-w-md bg-rabuste-surface border border-rabuste-text/5 p-8 md:p-10 rounded-xl shadow-2xl relative z-10 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-rabuste-orange to-orange-700 p-4 rounded-full mb-6 shadow-lg shadow-orange-600/30">
            <Coffee className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-rabuste-text tracking-wider">
            Welcome Back
          </h1>
          <p className="text-rabuste-muted text-sm mt-2 font-sans tracking-widest uppercase">
            Rabuste Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded text-center animate-shake">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-sm p-3 rounded text-center">
              {successMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-rabuste-muted ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-rabuste-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-rabuste-bg border border-rabuste-text/10 rounded-lg pl-10 p-3 text-rabuste-text focus:outline-none focus:border-rabuste-gold focus:ring-1 focus:ring-rabuste-gold transition-all"
                placeholder="admin@rabuste.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-rabuste-muted ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-rabuste-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-rabuste-bg border border-rabuste-text/10 rounded-lg pl-10 p-3 text-rabuste-text focus:outline-none focus:border-rabuste-gold focus:ring-1 focus:ring-rabuste-gold transition-all"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-xs text-rabuste-gold hover:text-rabuste-orange font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                {resetLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <KeyRound size={12} />
                )}
                Forgot Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-rabuste-orange hover:bg-rabuste-gold text-white font-bold py-3.5 rounded-lg transition-all duration-300 uppercase tracking-widest text-sm shadow-lg hover:shadow-orange-500/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Authenticating...
              </>
            ) : (
              "Access Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
