import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/admin/dashboard");
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center p-12 border-r border-gray-100 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
          <img
            src="/assets/logo.png"
            alt="AnchorBVFS Logo"
            className="w-48 h-auto object-contain"
          />
          <div className="space-y-2">
            <h1 className="text-4xl font-playfair font-bold text-primary">
              AnchorBVFS
            </h1>
            <p className="text-gray-500 text-lg">Admin Control Panel</p>
          </div>
        </div>
        {/* Decorative background circles or patterns could go here */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-playfair font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="pt-6 text-center">
            <span className="text-sm text-black">
              powered by
              <a
                href="https://uncoredigital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors font-medium ml-1"
              >
                @uncoredigital
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
