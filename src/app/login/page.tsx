
"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Hexagon, LogIn, UserPlus } from "lucide-react";

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
        toast({ title: "Account created successfully" });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome back" });
      }
      router.push("/");
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  const googleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/");
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 border border-primary/20 mb-4">
            <Hexagon className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-foreground uppercase">MonoNote AI</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-mono opacity-60">System Authentication Required</p>
        </div>

        <Card className="bg-card/50 border-border/40 shadow-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{isRegistering ? "Register New Consciousness" : "Access Database"}</CardTitle>
            <CardDescription>Enter credentials to synchronize metadata.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="USER_IDENTIFIER@DOMAIN"
                  value={email}
                  onChange={(e) => setEmail}
                  required
                  className="bg-muted/50 border-border/40 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="ACCESS_KEY_SECRET"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-muted/50 border-border/40 focus:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full h-11 uppercase font-bold tracking-widest gap-2">
                {isRegistering ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {isRegistering ? "Register_User" : "Initialize_Session"}
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/40"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">OR_VIA_EXTERNAL</span></div>
            </div>

            <Button variant="outline" onClick={googleSignIn} className="w-full border-border/40 h-11 uppercase tracking-widest">
              Google_Service_Link
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/40 pt-4 mt-2">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest underline decoration-primary/30 underline-offset-4"
            >
              {isRegistering ? "Existing_User?_Log_In" : "New_Intelligence?_Register"}
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
