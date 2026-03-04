import type { Player } from "../../lib/types";
import { cn, getInitials } from "../../lib/utils";

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
}

export function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {players.map((player) => (
        <div
          key={player.id}
          className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1.5",
            player.id === currentPlayerId
              ? "bg-neon-pink/20 border border-neon-pink/40"
              : "bg-white/5 border border-glass-border",
          )}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neon-blue/20 text-xs font-bold text-neon-blue">
            {getInitials(player.name)}
          </div>
          <span className="text-sm font-medium">{player.name}</span>
          {player.is_host && (
            <span className="text-xs" title="Host">👑</span>
          )}
        </div>
      ))}
    </div>
  );
}
