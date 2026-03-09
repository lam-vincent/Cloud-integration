import { toast } from "sonner";

const BASE_URL = "";

export const api = {
  getPolls: async () => {
    const res = await fetch(`${BASE_URL}/api/polls`);
    if (!res.ok) throw new Error("Failed to fetch polls");
    const data = await res.json();
    const polls = data.map((poll) => ({ ...poll, title: poll.question }));
    toast.success("Polls fetched successfully", { id: "fetch-polls" });
    return polls;
  },

  getPoll: async (id) => {
    const res = await fetch(`${BASE_URL}/api/polls/${id}`);
    if (!res.ok) {
      toast.error("Poll not found");
      return { error: "Not found" };
    }
    const poll = await res.json();
    const mapped = { ...poll, title: poll.question };
    toast.success(`Joined room: ${mapped.title}`, { id: `join-${id}` });
    return mapped;
  },

  createPoll: async (data) => {
    const res = await fetch(`${BASE_URL}/api/polls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: data.title,
        options: ["1", "2", "3", "5", "8", "13", "21", "?"],
      }),
    });
    if (!res.ok) throw new Error("Failed to create poll");
    const newPoll = await res.json();
    const mapped = { ...newPoll, title: newPoll.question };
    toast.success("New session created!");
    return mapped;
  },

  postVote: async (voteData) => {
    const res = await fetch(`${BASE_URL}/api/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pollId: voteData.pollId,
        option: voteData.voteValue,
      }),
    });
    if (!res.ok) throw new Error("Failed to submit vote");
    toast.info(`Vote registered: ${voteData.voteValue}`, {
      description: "Your estimate has been sent to the server.",
    });
    return { status: "success" };
  },
};
