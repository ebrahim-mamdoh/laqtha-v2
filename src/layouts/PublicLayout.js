export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 to-black">
      <div className="w-full max-w-3xl bg-black/40 rounded-xl shadow-lg p-8">
        {children}
      </div>
    </div>
  );
}
