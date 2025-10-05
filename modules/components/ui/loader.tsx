export function Loader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export function LoaderWithText({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
