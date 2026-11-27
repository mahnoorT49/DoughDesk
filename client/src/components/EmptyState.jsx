// Friendly message for an empty list, with an optional button
export default function EmptyState({ message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
      {actionLabel && <button className="btn-primary" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}