import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [usernameInput, setUsernameInput] = useState("");
  const [showPrompt, setShowPrompt] = useState(!localStorage.getItem("username"));

  useEffect(() => {
    api.getPolls().then(setPolls).catch(console.error);
  }, []);

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    localStorage.setItem("username", usernameInput.trim());
    setUsername(usernameInput.trim());
    setShowPrompt(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle) return;
    const poll = await api.createPoll({ title: newTitle });
    setPolls([...polls, poll]);
    setNewTitle("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Dialog open={showPrompt} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" hideClose>
          <DialogHeader>
            <DialogTitle>Welcome to Planning Poker</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Enter your name to join the lobby.
          </p>
          <form onSubmit={handleSetUsername} className="flex gap-2 mt-2">
            <Input
              placeholder="Your name..."
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              autoFocus
            />
            <Button type="submit">Join</Button>
          </form>
        </DialogContent>
      </Dialog>

      {username && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Playing as <span className="font-semibold text-foreground">{username}</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem("username");
              setUsername("");
              setUsernameInput("");
              setShowPrompt(true);
            }}
          >
            Change name
          </Button>
        </div>
      )}

      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          placeholder="Enter project name..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Button type="submit">Create New Session</Button>
      </form>

      <div className="grid gap-4">
        {polls.map((poll) => (
          <Link key={poll.id} to={`/poll/${poll.id}`}>
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {poll.title}
                  <span className="text-xs font-normal text-slate-400">ID: {poll.id}</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
