import { Button } from "@/components/ui/button"

export default function PokerCard({ value, isSelected, onSelect }) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={`h-24 w-16 text-xl font-bold transition-all ${
        isSelected ? "scale-110 shadow-lg" : "hover:bg-slate-100"
      }`}
      onClick={() => onSelect(value)}
    >
      {value}
    </Button>
  )
}