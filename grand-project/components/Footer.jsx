export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-10 py-6 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} Chef Paxto. All rights reserved.</p>
      <p>Built with 💚 using Supabase, MongoDB & n8n</p>
    </footer>
  );
}
