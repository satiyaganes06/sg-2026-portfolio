import { neon } from "@neondatabase/serverless";

export default function CommentsPage() {
  async function create(formData: FormData) {
    "use server";
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL!);
    const comment = formData.get("comment");
    if (!comment || typeof comment !== "string") return;
    await sql`INSERT INTO comments (comment) VALUES (${comment})`;
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-8 flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold text-white mb-6">Comments</h1>
      <form action={create} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Write a comment"
          name="comment"
          className="px-4 py-3 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:border-red-500/50 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 font-medium border border-red-500/30 hover:bg-red-500/30 transition-colors"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
