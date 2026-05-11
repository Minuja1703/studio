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
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      router.push("/");
    } catch (err: any) {
      toast({ 
        title: "Auth Error", 
        description: err.message, 
        variant: "destructive" 
      });
    }
  };

  const googleSignIn = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/");
    } catch (err: any) {
      // Gracefully handle the popup closed by user error
      if (err.code === 'auth/popup-closed-by-user') {
        return;
      }
      
      toast({ 
        title: "Sign in failed", 
        description: err.code === "auth/unauthorised-domain" 
          ? "This domain is not authorized. Please add it in the Firebase Console under Authentication > Settings > Authorized domains."
          : err.message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 bg-white/60 p-8 rounded-[2rem] shadow-2xl border border-white/40">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl">
            N
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-primary">MonoNote</h1>
          <p className="text-sm text-primary/70 font-medium">Professional Archive Gallery</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl h-12 border-primary/10 focus:border-primary bg-white/50 text-primary placeholder:text-primary/40"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl h-12 border-primary/10 focus:border-primary bg-white/50 text-primary placeholder:text-primary/40"
            />
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 transition-all text-white">
            {isRegistering ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="flex flex-col gap-4">
          <Button variant="outline" onClick={googleSignIn} className="w-full h-12 rounded-xl border-primary/20 text-primary hover:bg-primary/5 transition-all bg-white/30 font-bold">
            Continue with Google
          </Button>
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm font-bold text-primary/60 hover:text-primary transition-colors underline"
          >
            {isRegistering ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
