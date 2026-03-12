import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import PokerCard from "@/components/PokerCard";
import { Badge } from "@/components/ui/badge";
import VoterList from "@/components/VoterList";

const VOTE_OPTIONS = ["1", "2", "3", "5", "8", "13", "21", "?"];

export default function PollRoom() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedVote, setSelectedVote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votes, setVotes] = useState([]);
  const [revealed, setRevealed] = useState(false);

  const username = localStorage.getItem("username") || "Anonymous";

  useEffect(() => {
    api.getPoll(id).then(setPoll).catch(console.error);
  }, [id]);

  useEffect(() => {
    const source = new EventSource(`/api/polls/${id}/votes/stream`);
    source.onmessage = (e) => setVotes(JSON.parse(e.data));
    source.onerror = () => source.close();
    return () => source.close();
  }, [id]);

  const handleVote = async (value) => {
    if (value === selectedVote || isSubmitting) return;
    setSelectedVote(value);
    setIsSubmitting(true);
    try {
      await api.postVote({ pollId: id, voteValue: value, username });
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
        <div className="p-6 bg-slate-100 rounded-full inline-block">
          You voted: <span className="font-bold">{selectedVote}</span>
        </div>
      )}

      <section className="space-y-4 text-left max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Participants ({votes.length})
          </h2>
          {votes.length > 0 && (
            <Button
              size="sm"
              variant={revealed ? "secondary" : "default"}
              onClick={() => setRevealed((r) => !r)}
            >
              {revealed ? "Hide votes" : "Reveal votes"}
            </Button>
          )}
        </div>
        <VoterList votes={votes} revealed={revealed} />
      </section>
    </div>
  );
}
