import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Check, Star, Gift, Calendar, Users, Zap } from 'lucide-react';

export default function Contract() {
  const [contractSigned, setContractSigned] = useState(false);
  const [signingProgress, setSigningProgress] = useState(0);

  const handleSignContract = () => {
    setSigningProgress(25);
    setTimeout(() => setSigningProgress(50), 500);
    setTimeout(() => setSigningProgress(75), 1000);
    setTimeout(() => setSigningProgress(100), 1500);
    setTimeout(() => setContractSigned(true), 2000);
  };

  const playerStats = {
    name: "Lionel Messi",
    rating: 99,
    position: "RWF",
    team: "PSG",
    age: 36,
    pace: 85,
    shooting: 99,
    passing: 99,
    dribbling: 99,
    defending: 40,
    physical: 75
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-konami-blue to-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <img 
              src="https://cdn.builder.io/api/v1/assets/6489dacc0a404795897141b1d2151faa/konami-logo.wine-1f439a?format=webp&width=800" 
              alt="Konami Logo" 
              className="h-8 w-auto"
            />
            <div className="text-2xl font-bold text-konami-yellow">eFootball™ 26</div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {!contractSigned ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Epic Player Contract
              </h1>
              <p className="text-xl text-muted-foreground">
                Review and sign your contract with {playerStats.name}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Player Card */}
              <Card className="bg-gradient-to-br from-card to-muted/20 border-konami-yellow/20">
                <CardHeader className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-konami-yellow to-konami-purple rounded-full flex items-center justify-center mb-4">
                    <Users className="w-16 h-16 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{playerStats.name}</CardTitle>
                  <div className="flex justify-center space-x-2">
                    <Badge variant="secondary">{playerStats.position}</Badge>
                    <Badge className="bg-konami-purple text-white">{playerStats.rating}</Badge>
                    <Badge variant="outline">{playerStats.team}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Age</span>
                      <span className="text-sm">{playerStats.age} years</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pace</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={playerStats.pace} className="w-20" />
                          <span className="text-sm font-medium">{playerStats.pace}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Shooting</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={playerStats.shooting} className="w-20" />
                          <span className="text-sm font-medium">{playerStats.shooting}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Passing</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={playerStats.passing} className="w-20" />
                          <span className="text-sm font-medium">{playerStats.passing}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Dribbling</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={playerStats.dribbling} className="w-20" />
                          <span className="text-sm font-medium">{playerStats.dribbling}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Defending</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={playerStats.defending} className="w-20" />
                          <span className="text-sm font-medium">{playerStats.defending}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Physical</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={playerStats.physical} className="w-20" />
                          <span className="text-sm font-medium">{playerStats.physical}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contract Details */}
              <Card className="bg-card/50 border-konami-green/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-konami-green" />
                    <span>FREE Epic Contract</span>
                  </CardTitle>
                  <CardDescription>
                    Premium player contract at absolutely no cost
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-konami-green">FREE</div>
                      <div className="text-sm text-muted-foreground">Contract Value</div>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-konami-yellow">∞</div>
                      <div className="text-sm text-muted-foreground">Contract Length</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Contract Benefits</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-konami-green" />
                        <span className="text-sm">Unlimited gameplay access</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-konami-green" />
                        <span className="text-sm">Full player customization</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-konami-green" />
                        <span className="text-sm">Championship tournament access</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-konami-green" />
                        <span className="text-sm">Global leaderboard participation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-konami-green" />
                        <span className="text-sm">Regular skill updates</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {signingProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Contract Processing</span>
                        <span>{signingProgress}%</span>
                      </div>
                      <Progress value={signingProgress} className="w-full" />
                    </div>
                  )}

                  <Button 
                    onClick={handleSignContract}
                    disabled={signingProgress > 0 && signingProgress < 100}
                    className="w-full bg-gradient-to-r from-konami-green to-konami-blue hover:from-konami-green/90 hover:to-konami-blue/90 text-white text-lg py-6"
                  >
                    {signingProgress === 0 ? (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Sign Epic Contract
                      </>
                    ) : signingProgress < 100 ? (
                      <>
                        <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Processing Contract...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Contract Processing Complete
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-gradient-to-br from-konami-green/20 to-konami-yellow/20 border-konami-green">
              <CardHeader>
                <div className="w-20 h-20 mx-auto bg-konami-green rounded-full flex items-center justify-center mb-4">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-konami-green">Contract Signed Successfully!</CardTitle>
                <CardDescription className="text-lg">
                  {playerStats.name} is now part of your epic team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <Badge className="bg-konami-yellow text-black font-semibold px-4 py-2">
                    <Star className="w-4 h-4 mr-2" />
                    Epic Player Added
                  </Badge>
                  <Badge className="bg-konami-green text-white font-semibold px-4 py-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Active Contract
                  </Badge>
                </div>

                <Separator />

                <p className="text-muted-foreground">
                  Your epic player is ready for action! Start playing matches, 
                  compete in tournaments, and build your legendary team.
                </p>

                <div className="flex space-x-4">
                  <Button asChild className="flex-1 bg-konami-blue hover:bg-konami-blue/90 text-white">
                    <Link to="/">
                      Sign More Players
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
