// Re-mounts on every navigation, so the CSS entrance plays per page.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
