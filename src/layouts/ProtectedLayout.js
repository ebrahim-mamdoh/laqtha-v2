export default function ProtectedLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar ثابت */}
     

      {/* المحتوى */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
