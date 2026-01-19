import { toast } from "sonner";

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Database initialization
if (!localStorage.getItem("mock_polls")) {
  localStorage.setItem(
    "mock_polls",
    JSON.stringify([
      { id: "1", title: "Frontend Refactor" },
      { id: "2", title: "API Integration" },
    ])
  );
}

export const api = {
  getPolls: async () => {
    await delay();
    const data = JSON.parse(localStorage.getItem("mock_polls"));
    // Using a fixed ID prevents duplicates
    toast.success("Polls fetched successfully", { id: "fetch-polls" });
    return data;
  },

  getPoll: async (id) => {
    await delay();
    const polls = JSON.parse(localStorage.getItem("mock_polls"));
    const poll = polls.find((p) => p.id === id);

    if (poll) {
      toast.success(`Joined room: ${poll.title}`, { id: `join-${id}` });
      return poll;
    } else {
      toast.error("Poll not found");
      return { error: "Not found" };
    }
  },

  createPoll: async (data) => {
    await delay(1000);
    const polls = JSON.parse(localStorage.getItem("mock_polls"));
    const newPoll = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
    };
    localStorage.setItem("mock_polls", JSON.stringify([...polls, newPoll]));

    toast.success("New session created!");
    return newPoll;
  },

  postVote: async (voteData) => {
    await delay(500);
    toast.info(`Vote registered: ${voteData.voteValue}`, {
      description: "Your estimate has been sent to the server.",
    });
    return { status: "success" };
  },
};
