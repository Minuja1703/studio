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
    
    if (!auth) {
      toast({ 
        title: "Setup Required", 
        description: "Firebase is not yet configured. Please add your API keys to proceed.", 
        variant: "destructive" 
      });
      return;
    }

    const cleanEmail = email.trim();
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa] relative overflow-hidden">
      {/* Decorative "N" element - matches the circular badge in the reference */}
      <div className="hidden lg:flex absolute left-12 top-1/2 -translate-y-1/2 w-14 h-14 items-center justify-center rounded-full bg-neutral-900 text-white font-semibold text-lg shadow-2xl z-10">
        N
      </div>

      <div className="w-full max-w-sm space-y-12 relative z-20">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.75rem] bg-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.08)] border border-neutral-100 mb-2">
            <NotebookPen className="w-8 h-8 text-neutral-800" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">MonoNote</h1>
            <p className="text-sm text-neutral-400 font-medium uppercase tracking-[0.1em]">Your refined space for thoughts.</p>
          </div>
        </div>

        <Card className="border border-neutral-100 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.12)] bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="space-y-2 pb-8 pt-12 px-10">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {isRegistering ? "Create Account" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-neutral-400 font-medium text-sm">
              {isRegistering ? "Join a collective of minimalist thinkers." : "Welcome back to your collection."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 px-10">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-neutral-50/50 border-neutral-100 h-14 rounded-2xl px-6 focus-visible:ring-1 focus-visible:ring-neutral-200 transition-all placeholder:text-neutral-300 text-base"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-neutral-50/50 border-neutral-100 h-14 rounded-2xl px-6 focus-visible:ring-1 focus-visible:ring-neutral-200 transition-all placeholder:text-neutral-300 text-base"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-2xl shadow-2xl shadow-neutral-200 transition-all active:scale-[0.98]"
              >
                {isRegistering ? "Register Entry" : "Open Archive"}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-100"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-bold">
                <span className="bg-white px-4 text-neutral-300">Authentication</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={googleSignIn} 
              className="w-full h-14 border-neutral-100 font-semibold rounded-2xl hover:bg-neutral-50 transition-all text-neutral-600"
            >
              Continue with Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center pb-12">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-bold uppercase tracking-widest text-neutral-300 hover:text-neutral-900 transition-colors"
            >
              {isRegistering ? "Return to Sign In" : "New? Create Account"}
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
