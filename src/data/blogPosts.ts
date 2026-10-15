import type { BlogPost } from "@/types/content";
import { site } from "./site";
export const blogCategories = [
  "Software Architecture",
  "Next.js",
  "AI Agents",
  "AI Adoption",
  "Responsible AI",
  "Career and Learning",
];
export const blogPosts: BlogPost[] = [
  {
    slug: "architecture-starts-with-questions",
    title: "Good architecture starts with better questions",
    summary:
      "Before choosing a framework, make the problem, the people, and the constraints visible.",
    category: "Software Architecture",
    tags: ["Architecture", "Decision-making"],
    image: "/images/blog/architecture.png",
    sections: [
      {
        title: "Start with the work",
        paragraphs: [
          "A technology decision becomes easier to discuss when it is attached to a specific piece of work. Who needs to do what, and what currently gets in the way? A simple description of the task often reveals more than a long list of tools.",
          "Write down the primary user, the desired result, and the known constraint. Keep assumptions separate from facts. A team can disagree usefully when it knows which part of the problem is still uncertain.",
        ],
      },
      {
        title: "Make trade-offs visible",
        paragraphs: [
          "Every option has costs. A familiar framework may reduce learning time but constrain a particular interaction. A flexible system may require more ownership than a small team can provide. Naming these trade-offs is more useful than declaring a universal winner.",
        ],
        bullets: [
          "What decision are we making?",
          "Which constraints are verified?",
          "What alternatives did we consider?",
          "What evidence would change this decision?",
        ],
      },
      {
        title: "Keep the record short",
        paragraphs: [
          "A decision record can be a few paragraphs: context, options, decision, and consequences. Its purpose is to explain why a choice made sense at the time, not to predict every future requirement.",
        ],
        callout:
          "An architecture diagram should support a conversation. It is not a substitute for confirming the assumptions behind it.",
      },
      {
        title: "Revisit deliberately",
        paragraphs: [
          "Agree on a trigger for review, such as a new user group or a changed performance requirement. This helps a team adapt without repeatedly reopening settled discussions.",
          "For your next project, try writing one decision record before adding another dependency. The exercise may reveal that the smallest workable solution is also the easiest to explain.",
        ],
      },
    ],
  },
  {
    slug: "server-and-client-boundaries",
    title: "A practical boundary between server and client",
    summary:
      "Keep content simple and add client-side behavior only where an interaction needs it.",
    category: "Next.js",
    tags: ["Next.js", "React", "TypeScript"],
    image: "/images/blog/frontend.png",
    sections: [
      {
        title: "Begin with content",
        paragraphs: [
          "A page that reads local content and renders headings, links, and cards does not need browser state. In the App Router, that composition can remain a Server Component and be rendered ahead of time.",
          "Server Component does not mean that your application needs a custom backend. A static portfolio can use server-side rendering during the build while keeping all domain data in local files.",
        ],
      },
      {
        title: "Isolate the interaction",
        paragraphs: [
          "Search, theme selection, and form feedback need browser behavior. Give those features small Client Components with explicit, serializable inputs. Avoid placing a client directive at the top of a whole page merely because one control is interactive.",
        ],
        code: "type SearchProps = { titles: string[] };\n\nexport function matchTitles(titles: string[], query: string) {\n  const normalized = query.trim().toLowerCase();\n  return titles.filter((title) =>\n    title.toLowerCase().includes(normalized),\n  );\n}",
      },
      {
        title: "Keep contracts understandable",
        paragraphs: [
          "Pass the content the control needs rather than an entire application configuration. Keep filtering rules in a plain utility so the component can focus on labels, state, and feedback.",
        ],
      },
      {
        title: "Review the resulting experience",
        paragraphs: [
          "Check loading, empty results, focus visibility, and small-screen layouts. A narrow technical boundary is useful only when the resulting interaction still feels complete.",
        ],
        callout:
          "Local data, static generation, and small Client Components are a useful learning combination. They do not implement persistence or form delivery.",
      },
    ],
  },
  {
    slug: "human-checkpoints-for-ai",
    title: "Design the human checkpoint before the agent",
    summary:
      "A useful AI concept needs clear responsibilities, visible uncertainty, and a way to stop.",
    category: "AI Agents",
    tags: ["Responsible AI", "Human Approval"],
    image: "/images/blog/knowledge.png",
    sections: [
      {
        title: "Define a bounded task",
        paragraphs: [
          "Start with a narrow task that someone can explain and review. Finding relevant knowledge is a different responsibility from changing a business record. Combining them without explicit boundaries can hide important risks.",
          "List the information the assistant would need, where that information comes from, and who is allowed to see it. A demonstration should not use confidential documents merely to make the example feel realistic.",
        ],
      },
      {
        title: "Make uncertainty part of the interface",
        paragraphs: [
          "A proposed response should expose its supporting context and allow a reviewer to decline it. Missing evidence, conflicting sources, and out-of-scope questions deserve explicit states, not confident-looking placeholders.",
        ],
        bullets: [
          "Show sources and known limitations",
          "Allow correction or rejection",
          "Escalate ambiguous situations",
          "Stop before a consequential action",
        ],
      },
      {
        title: "Assign ownership",
        paragraphs: [
          "A human checkpoint needs a named responsibility, enough review context, and a clear consequence of approval. A generic approve button is not an oversight strategy.",
        ],
        callout:
          "This article describes design concepts. No AI agent, model integration, or automated action runs on this website.",
      },
      {
        title: "Evaluate before expanding",
        paragraphs: [
          "Collect representative, non-confidential scenarios and discuss what an acceptable response would look like. Include failure cases. Only then consider whether broader automation is justified.",
        ],
      },
    ],
  },
  {
    slug: "learning-through-small-projects",
    title: "Small projects, deliberate learning",
    summary:
      "Choose one complete user journey and use it to connect concepts to practical decisions.",
    category: "Career and Learning",
    tags: ["Learning", "Frontend"],
    image: "/images/blog/frontend.png",
    sections: [
      {
        title: "Pick a finishable journey",
        paragraphs: [
          "A searchable reading list or a course catalog can teach more than an unfinished all-purpose platform. Define what a visitor should be able to do, then build that journey from start to finish.",
        ],
      },
      {
        title: "Explain the choices",
        paragraphs: [
          "Write down why you used a particular data model, component boundary, or validation rule. Explaining the choice is an opportunity to notice a gap in understanding before the project grows.",
        ],
      },
      {
        title: "Review like a visitor",
        paragraphs: [
          "Try an empty search, a long title, an invalid email, and keyboard-only navigation. These ordinary situations reveal whether the interface is complete.",
        ],
        bullets: [
          "Start with a clear objective",
          "Keep a short decision log",
          "Review one journey on mobile",
          "Describe what remains unverified",
        ],
      },
    ],
  },
  {
    slug: "start-with-the-workflow-not-the-model",
    title: "Start with the workflow, not the model",
    summary:
      "A practical AI opportunity begins with a recurring task, a person who owns it, and a clear reason the current process needs to change.",
    category: "AI Adoption",
    tags: ["AI Discovery", "Workflow Design", "Product Strategy"],
    image: "/images/blog/architecture.png",
    sections: [
      {
        title: "Describe the work as it happens today",
        paragraphs: [
          "Choose a real task: triaging a request, finding a policy, preparing a first draft, or handing work to another team. Describe who starts it, what information they need, where delays or rework occur, and who is responsible for the result.",
          "This is more useful than beginning with a model because it creates a baseline. Without a clear picture of the current process, a team cannot tell whether an AI feature improved it or merely added another screen.",
        ],
      },
      {
        title: "Check whether AI is the right tool",
        paragraphs: [
          "Some tasks need a deterministic rule, better search, clearer ownership, or a simpler form. Generative AI may be useful when inputs vary and a flexible draft or explanation helps, but variability also makes evaluation and review more important.",
        ],
        bullets: [
          "Is the task frequent enough to matter?",
          "Can a person recognize a good and a bad result?",
          "Can the system use information it is allowed to access?",
          "What happens when the answer is incomplete or wrong?",
          "Would a simpler product or process change solve the problem?",
        ],
      },
      {
        title: "Set a boundary around the first test",
        paragraphs: [
          "Define one user group, one task, and one low-risk output. Decide what the system may read or propose, what it must never do, and where a person reviews the result. Keep high-impact decisions and irreversible actions outside an early experiment.",
        ],
        callout:
          "A bounded pilot is a way to learn, not evidence that a production system is safe or valuable.",
      },
      {
        title: "Agree on evidence before building",
        paragraphs: [
          "Collect representative examples that do not expose confidential information. Write down what an acceptable result looks like, how omissions and unsupported claims will be handled, and who will review edge cases. Include the time and effort required to correct mistakes.",
          "A useful next step may be a workflow map, a data-readiness review, or a prototype with simulated inputs. Build only when the question and the evidence needed to answer it are clear.",
        ],
      },
    ],
  },
  {
    slug: "evaluate-ai-with-realistic-cases",
    title: "Evaluate AI with realistic cases, not a polished demo",
    summary:
      "A small evaluation set can expose gaps in quality, source coverage, and human review before a team expands an AI experiment.",
    category: "Responsible AI",
    tags: ["Evaluation", "AI Quality", "Human Oversight"],
    image: "/images/blog/knowledge.png",
    sections: [
      {
        title: "Turn expectations into examples",
        paragraphs: [
          "Write down the task the AI is expected to perform and gather realistic examples of that task. Include routine requests, incomplete inputs, ambiguous language, conflicting information, and cases that should be declined or escalated.",
          "For each example, record the important evidence and the qualities a reviewer would expect from a useful response. This makes evaluation more concrete than asking whether an answer simply feels good.",
        ],
      },
      {
        title: "Look beyond the final answer",
        paragraphs: [
          "A response can sound plausible while using the wrong source or missing a key condition. Review whether the output is supported, relevant, complete enough for its purpose, and appropriately cautious. For retrieval experiences, check whether the expected source can be found and whether its context is represented fairly.",
        ],
        bullets: [
          "Correctness against a reviewed reference",
          "Source relevance and coverage",
          "Unsupported claims and omissions",
          "Consistency across repeated or varied inputs",
          "Clarity about uncertainty and limitations",
          "Time required for a person to review and correct",
        ],
      },
      {
        title: "Test the failure path",
        paragraphs: [
          "Ask what the system should do when it has no evidence, encounters contradictory sources, receives an out-of-scope request, or cannot access required information. A safe response may be to ask a question, explain the limitation, or hand the task to a person.",
          "Keep a record of the examples, expected behavior, observed behavior, and changes made. If a model, prompt, source set, or workflow changes, revisit the relevant tests rather than assuming earlier results still apply.",
        ],
        callout:
          "An evaluation set helps teams make a decision. It does not guarantee future performance or replace monitoring and human accountability.",
      },
      {
        title: "Connect quality to a real decision",
        paragraphs: [
          "Decide in advance what evidence would justify a next step and what would stop the experiment. Include operational effort, access controls, review burden, and the cost of an incorrect answer—not only response quality.",
          "If the available evidence is weak, narrow the task or improve the source material. The right result of an evaluation can be deciding not to use AI for that workflow.",
        ],
      },
    ],
  },
  {
    slug: "design-knowledge-assistants-for-trust",
    title: "Design knowledge assistants people can verify",
    summary:
      "A useful knowledge assistant depends on trustworthy sources, appropriate access, visible evidence, and a clear response when information is missing.",
    category: "AI Agents",
    tags: ["Knowledge Assistants", "Data Access", "Responsible AI"],
    image: "/images/blog/knowledge.png",
    sections: [
      {
        title: "Treat source quality as product quality",
        paragraphs: [
          "An assistant cannot reliably clarify guidance that is outdated, contradictory, or difficult to identify. Before designing a chat interface, understand who owns the content, how it changes, which versions are authoritative, and how obsolete material is removed.",
          "Content preparation is operational work. Someone needs responsibility for corrections, review dates, and changes in policy or procedure.",
        ],
      },
      {
        title: "Respect existing access boundaries",
        paragraphs: [
          "Retrieval must not quietly turn restricted documents into generally available answers. Map who can see each source, how identity is established, and whether permissions continue to apply throughout retrieval and response generation.",
          "Begin with approved, non-sensitive examples when exploring an idea. Review privacy, security, retention, and provider terms before considering production information.",
        ],
      },
      {
        title: "Make evidence easy to inspect",
        paragraphs: [
          "Show the relevant source and enough context for a person to check whether it supports the response. Distinguish a direct quotation from a generated summary, and do not imply that a citation proves the entire answer.",
        ],
        bullets: [
          "Expose source title and relevant passage",
          "Indicate when the available material does not answer the question",
          "Handle conflicting or dated guidance explicitly",
          "Make correction and escalation possible",
          "Keep consequential actions behind an accountable review",
        ],
      },
      {
        title: "Measure whether it helps people",
        paragraphs: [
          "Test whether representative questions find appropriate sources and whether users can notice unsupported or incomplete answers. Include tasks where the right behavior is to say that evidence is missing.",
          "A useful knowledge assistant is not measured only by how often it responds. Consider whether people can complete the task more clearly, how much review is needed, and whether the source material remains trustworthy over time.",
        ],
        callout:
          "A citation, confidence label, or disclaimer is not a substitute for access control, quality evaluation, and clear ownership.",
      },
    ],
  },
].map((post) => ({
  ...post,
  author: site.name,
  published: "2026-10-13",
  updated: "2026-10-13",
  imageAlt: `${post.category}: illustrative technology composition`,
  label: "PraedicoAI Insights",
  featured: ["AI Adoption", "Responsible AI", "AI Agents"].includes(
    post.category,
  ),
}));
export const getBlogPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);
export const getRelatedBlogPosts = (post: BlogPost) =>
  blogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort(
      (left, right) =>
        Number(right.category === post.category) -
        Number(left.category === post.category),
    )
    .slice(0, 3);
