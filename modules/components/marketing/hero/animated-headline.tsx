interface AnimatedHeadlineProps {
  children: string;
  className?: string;
}

export function AnimatedHeadline({
  children,
  className = "",
}: AnimatedHeadlineProps) {
  return <h1 className={className}>{children}</h1>;
}
