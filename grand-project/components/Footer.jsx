export default function Footer() {
  return (
    <footer className="bg-green-50 mt-10 py-6 text-center text-sm text-green-800 border-t border-green-200">
      <p>© {new Date().getFullYear()} <span className="font-semibold">Chef Paxto</span>. All rights reserved.</p>
      <p className="text-green-700">Built with 💚 using Supabase, MongoDB & n8n</p>
    </footer>
  );
}
