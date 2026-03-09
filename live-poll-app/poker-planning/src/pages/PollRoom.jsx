import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import PokerCard from "@/components/PokerCard";
import { Badge } from "@/components/ui/badge";

const VOTE_OPTIONS = ["1", "2", "3", "5", "8", "13", "21", "?"];

export default function PollRoom() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedVote, setSelectedVote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.getPoll(id).then(setPoll).catch(console.error);
  }, [id]);

  const handleVote = async (value) => {
    setSelectedVote(value);
    setIsSubmitting(true);
    try {
      await api.postVote({
        pollId: id,
        userId: "user_123", // You'd likely get this from auth or a prompt
        voteValue: value,
      });
    } catch (err) {
      console.error("Vote failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!poll)
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded mb-4"></div>
        <div className="h-4 w-32 bg-slate-100 rounded"></div>
      </div>
    );

  return (
    <div className="space-y-12 text-center animate-in zoom-in-95 duration-300">
      <div>
        <Link to="/" className="text-sm text-slate-500 hover:underline">
          ← Back to Lobby
        </Link>
        <h1 className="text-3xl font-bold mt-4">{poll.title}</h1>
        <Badge variant="outline" className="mt-2">
          Room ID: {id}
        </Badge>
      </div>

      <section className="space-y-6">
        <h2 className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
          Select your estimate
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {VOTE_OPTIONS.map((val) => (
            <PokerCard
              key={val}
              value={val}
              isSelected={selectedVote === val}
              onSelect={handleVote}
              disabled={isSubmitting}
            />
          ))}
        </div>
      </section>

      {selectedVote && (
        <div className="p-6 bg-slate-100 rounded-full inline-block animate-bounce">
          You voted: <span className="font-bold">{selectedVote}</span>
        </div>
      )}
    </div>
  );
}
