"use client";

import { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NotebookPen } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    
    if (!cleanEmail) {
      toast({ 
        title: "Validation error", 
        description: "Please enter a valid email address.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, cleanEmail, password);
        toast({ title: "Welcome to MonoNote", description: "Your account has been created." });
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
      router.push("/");
    } catch (err: any) {
      toast({ 
        title: "Authentication error", 
        description: err.message, 
        variant: "destructive" 
      });
    }
  };

  const googleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/");
    } catch (err: any) {
      toast({ 
        title: "Sign in failed", 
        description: err.message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa] relative overflow-hidden">
      {/* Decorative Floating 'N' element from image */}
      <div className="hidden lg:flex absolute left-8 md:left-12 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-xl bg-neutral-800 text-white font-medium text-sm shadow-xl z-10">
        N
      </div>

      <div className="w-full max-w-sm space-y-8 relative z-20">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm border border-neutral-100 mb-2">
            <NotebookPen className="w-6 h-6 text-neutral-800" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">MonoNote</h1>
          <p className="text-sm text-neutral-400 font-medium">Your quiet place for thoughts.</p>
        </div>

        <Card className="border border-neutral-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">
              {isRegistering ? "Create Account" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-neutral-400 font-medium text-xs">
              {isRegistering ? "Join our community of thinkers." : "Welcome back to your space."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-neutral-50/50 border-neutral-100 h-12 rounded-2xl px-4 focus-visible:ring-1 focus-visible:ring-neutral-200 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-neutral-50/50 border-neutral-100 h-12 rounded-2xl px-4 focus-visible:ring-1 focus-visible:ring-neutral-200 transition-all"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-2xl shadow-lg shadow-neutral-200 transition-all active:scale-[0.98]"
              >
                {isRegistering ? "Sign Up" : "Sign In"}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-100"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-white px-3 text-neutral-300">or</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={googleSignIn} 
              className="w-full h-12 border-neutral-100 font-semibold rounded-2xl hover:bg-neutral-50 transition-all text-neutral-600"
            >
              Continue with Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              {isRegistering ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
