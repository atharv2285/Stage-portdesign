import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface ConnectPlatformDialogProps {
  platform: string;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (data: any) => void;
}

export const ConnectPlatformDialog = ({
  platform,
  isOpen,
  onClose,
  onConnect,
}: ConnectPlatformDialogProps) => {
  const [username, setUsername] = useState("");
  const [channelId, setChannelId] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Use relative URLs so Vite proxy forwards to backend
      let response;
      
      switch (platform) {
        case "leetcode":
          if (!username.trim()) {
            toast.error("Please enter your LeetCode username");
            setIsLoading(false);
            return;
          }
          response = await fetch(`/api/leetcode/user/${username}`);
          break;
          
        case "codeforces":
          if (!username.trim()) {
            toast.error("Please enter your Codeforces handle");
            setIsLoading(false);
            return;
          }
          response = await fetch(`/api/codeforces/user/${username}`);
          break;
          
        case "youtube":
          if (!channelId.trim()) {
            toast.error("Please enter your YouTube channel ID");
            setIsLoading(false);
            return;
          }
          response = await fetch(`/api/youtube/channel/${channelId}`);
          break;
          
        case "linkedin":
          if (!profileUrl.trim()) {
            toast.error("Please enter your LinkedIn profile URL");
            setIsLoading(false);
            return;
          }
          response = await fetch(`/api/linkedin/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileUrl }),
          });
          break;
          
        default:
          toast.error("Platform not supported");
          setIsLoading(false);
          return;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch data');
      }

      const data = await response.json();
      console.log(`${platform} data received:`, data);
      onConnect(data);
      toast.success(`Successfully connected ${platform}!`);
      onClose();
      setUsername("");
      setChannelId("");
      setProfileUrl("");
    } catch (error: any) {
      console.error(`${platform} connection error:`, error);
      console.error('Error details:', error.message, error.stack);
      toast.error(error.message || `Failed to connect ${platform}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Connect {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </DialogTitle>
          <DialogDescription>
            {platform === "leetcode" && "Enter your LeetCode username to import your coding stats"}
            {platform === "codeforces" && "Enter your Codeforces handle to import your competitive programming stats"}
            {platform === "youtube" && "Enter your YouTube channel ID to display your content stats"}
            {platform === "linkedin" && "Enter your LinkedIn profile URL to import your professional data"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {platform === "leetcode" && (
            <div>
              <Label htmlFor="username">LeetCode Username</Label>
              <Input
                id="username"
                placeholder="e.g., john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleConnect()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Find your username in your LeetCode profile URL
              </p>
            </div>
          )}

          {platform === "codeforces" && (
            <div>
              <Label htmlFor="username">Codeforces Handle</Label>
              <Input
                id="username"
                placeholder="e.g., tourist"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleConnect()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your Codeforces username/handle
              </p>
            </div>
          )}

          {platform === "youtube" && (
            <div>
              <Label htmlFor="channelId">YouTube Channel ID</Label>
              <Input
                id="channelId"
                placeholder="e.g., UCxxxxxxxxxxxxxxxxxxxxxx"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleConnect()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Find your channel ID in YouTube Studio &gt; Settings &gt; Channel
              </p>
            </div>
          )}

          {platform === "linkedin" && (
            <div>
              <Label htmlFor="profileUrl">LinkedIn Profile URL</Label>
              <Input
                id="profileUrl"
                placeholder="e.g., https://linkedin.com/in/username"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleConnect()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Copy your public LinkedIn profile URL
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
