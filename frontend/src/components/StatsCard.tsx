type StatsCardProps = {
  label: string;
  value: number;
};

function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default StatsCard;
