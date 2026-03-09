export default function VoterList({ votes, revealed }) {
  if (votes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center">
        No votes yet. Be the first!
      </p>
    );
  }

  const summary = revealed
    ? votes.reduce((acc, v) => {
        acc[v.selected_option] = (acc[v.selected_option] || 0) + 1;
        return acc;
      }, {})
    : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-xs font-semibold uppercase text-muted-foreground px-2">
        <span>Player</span>
        <span className="text-center">Status</span>
        <span className="text-center">Vote</span>
      </div>

      {votes.map((v) => (
        <div
          key={v.username}
          className="grid grid-cols-3 gap-2 items-center bg-slate-50 rounded-lg px-4 py-3"
        >
          <span className="font-medium text-sm truncate">{v.username}</span>
          <span className="text-center text-sm text-green-600 font-medium">✓ Voted</span>
          <span className="text-center font-bold text-lg">
            {revealed ? v.selected_option : "🂠"}
          </span>
        </div>
      ))}

      {revealed && summary && (
        <div className="mt-4 pt-4 border-t space-y-1">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Summary</p>
          {Object.entries(summary)
            .sort((a, b) => {
              const order = ["1","2","3","5","8","13","21","?"];
              return order.indexOf(a[0]) - order.indexOf(b[0]);
            })
            .map(([val, count]) => (
              <div key={val} className="flex justify-between text-sm px-2">
                <span className="font-bold">{val}</span>
                <span className="text-muted-foreground">
                  {count} {count === 1 ? "vote" : "votes"}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
