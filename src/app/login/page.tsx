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
import { Notebook } from "lucide-react";

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
      toast({ 
        title: "Sign in failed", 
        description: err.message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
            N
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-primary">MonoNote</h1>
          <p className="text-sm text-muted-foreground">Minimalist design for focused thinking.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg h-12 border-blue-100 focus:border-primary"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-lg h-12 border-blue-100 focus:border-primary"
            />
          </div>
          <Button type="submit" className="w-full h-12 rounded-lg font-bold bg-primary hover:bg-primary/90">
            {isRegistering ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="flex flex-col gap-4">
          <Button variant="outline" onClick={googleSignIn} className="w-full h-12 rounded-lg border-blue-200 text-primary">
            Continue with Google
          </Button>
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline"
          >
            {isRegistering ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
