import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
  likes: { id: string; user_id: string }[];
}

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (full_name, email),
          likes (id, user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching posts',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPost.trim()) return;

    try {
      setPosting(true);
      const { error } = await supabase.from('posts').insert({
        user_id: user?.id,
        content: newPost.trim(),
      });

      if (error) throw error;

      toast({
        title: 'Post created!',
        description: 'Your post has been shared.',
      });

      setNewPost('');
      fetchPosts();
    } catch (error: any) {
      toast({
        title: 'Error creating post',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (postId: string, hasLiked: boolean) => {
    try {
      if (hasLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user?.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('likes').insert({
          post_id: postId,
          user_id: user?.id,
        });

        if (error) throw error;
      }

      fetchPosts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Social Feed</h1>
          <p className="text-muted-foreground">Share your progress and connect with others</p>
        </div>

        <Card className="mb-8 border-border/50">
          <CardHeader>
            <CardTitle>What's on your mind?</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createPost} className="space-y-4">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your thoughts, progress, or achievements..."
                rows={4}
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {newPost.length}/1000
                </span>
                <Button 
                  type="submit" 
                  disabled={!newPost.trim() || posting}
                  className="gap-2 bg-gradient-to-r from-primary to-secondary"
                >
                  <Send className="h-4 w-4" />
                  {posting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">Loading feed...</div>
        ) : posts.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const hasLiked = post.likes.some(like => like.user_id === user?.id);
              const likeCount = post.likes.length;

              return (
                <Card key={post.id} className="border-border/50">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                          {post.profiles.full_name?.[0] || post.profiles.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-base">
                          {post.profiles.full_name || post.profiles.email}
                        </CardTitle>
                        <CardDescription>
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                    <div className="flex items-center gap-4 pt-2 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id, hasLiked)}
                        className="gap-2"
                      >
                        <Heart
                          className={`h-4 w-4 ${hasLiked ? 'fill-accent text-accent' : ''}`}
                        />
                        <span>{likeCount}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>Comment</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
