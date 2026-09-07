import { NextResponse } from "next/server";
import { SKILL_VOCAB } from "@/lib/roleMap";

export async function POST(req: Request) {
  const { syllabus } = await req.json();

  const prompt = `You extract skills from a course syllabus. Choose ONLY from this exact list of skill names (copy them verbatim, do not invent new ones):
${SKILL_VOCAB.join(", ")}

Syllabus:
"""${syllabus}"""

Respond with ONLY a JSON array of the skill names from the list above that are genuinely covered by this syllabus. No preamble, no markdown, no code fences. Example valid response: ["Python","SQL","Statistics"]`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const textBlock = (data.content || []).find((b: any) => b.type === "text");
    if (!textBlock) throw new Error("No text in response");

    const clean = textBlock.text.trim().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    const skills = Array.isArray(parsed) ? parsed.filter((s: string) => SKILL_VOCAB.includes(s)) : [];

    return NextResponse.json({ skills });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ skills: [], error: "extraction_failed" }, { status: 500 });
  }
}
