import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LeaderboardEntry {
  user_id: string;
  points: number;
  tasks_completed: number;
  current_streak: number;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          user_id,
          points,
          tasks_completed,
          current_streak,
          profiles:user_id (full_name, email)
        `)
        .order('points', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLeaders(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching leaderboard',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return 'from-yellow-500/20 to-yellow-600/10';
    if (index === 1) return 'from-gray-400/20 to-gray-500/10';
    if (index === 2) return 'from-amber-600/20 to-amber-700/10';
    return 'from-card to-card';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">Top performers on the platform</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading leaderboard...</div>
        ) : leaders.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No data yet. Complete tasks to get on the board!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leaders.map((leader, index) => (
              <Card
                key={leader.user_id}
                className={`border-border/50 bg-gradient-to-r ${getRankColor(index)}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 font-bold text-xl">
                      {index < 3 ? getRankIcon(index) : `#${index + 1}`}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-lg">
                        {leader.profiles.full_name?.[0] || leader.profiles.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {leader.profiles.full_name || leader.profiles.email}
                      </CardTitle>
                      <CardDescription>
                        {leader.tasks_completed} tasks completed • {leader.current_streak} day streak
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {leader.points}
                      </div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
