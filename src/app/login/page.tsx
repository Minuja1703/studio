"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { NotebookPen } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome to MonoNote" });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err: any) {
      toast({ title: "Authentication error", description: err.message, variant: "destructive" });
    }
  };

  const googleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/");
    } catch (err: any) {
      toast({ title: "Sign in failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa]">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm border mb-2">
            <NotebookPen className="w-6 h-6 text-neutral-800" />
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-neutral-900">MonoNote</h1>
          <p className="text-sm text-neutral-500">Your quiet place for thoughts.</p>
        </div>

        <Card className="border-none shadow-xl shadow-neutral-200/50 bg-white p-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">{isRegistering ? "Create Account" : "Sign In"}</CardTitle>
            <CardDescription>
              {isRegistering ? "Join our community of thinkers." : "Welcome back to your space."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-neutral-50 border-neutral-200 h-11"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-neutral-50 border-neutral-200 h-11"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 font-medium bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg"
              >
                {isRegistering ? "Sign Up" : "Sign In"}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-neutral-400">or</span></div>
            </div>

            <Button variant="outline" onClick={googleSignIn} className="w-full h-11 border-neutral-200 font-medium">
              Continue with Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors underline-offset-4 hover:underline"
            >
              {isRegistering ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}