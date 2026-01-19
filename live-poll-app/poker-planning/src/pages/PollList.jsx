import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    api.getPolls().then(setPolls).catch(console.error);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle) return;
    const poll = await api.createPoll({ title: newTitle });
    setPolls([...polls, poll]);
    setNewTitle("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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