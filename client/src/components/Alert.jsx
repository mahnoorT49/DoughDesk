// type is "success" or "error". Shows nothing if there is no message.
export default function Alert({ type, children }) {
  if (!children) return null;
  return <div className={'alert alert-' + type}>{children}</div>;
}