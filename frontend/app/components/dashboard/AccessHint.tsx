export default function AccessHint({ text }: { text: string }) {
  return (
    <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      {text}
    </p>
  );
}
