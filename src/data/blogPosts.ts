import type { BlogPost } from "@/types/content";
import { site } from "./site";
export const blogCategories = [
  "Software Architecture",
  "Web Development",
  "Next.js",
  "TypeScript",
  "AI Agents",
  "Generative AI",
  "Workflow Concepts",
  "Digital Transformation",
  "Manufacturing Technology",
  "Career and Learning",
  "Training",
  "Digital Marketing",
  "Personal Branding",
  "Social Media",
  "Technology Leadership",
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
].map((post, index) => ({
  ...post,
  author: site.name,
  published: "2026-10-13",
  updated: "2026-10-13",
  imageAlt: `${post.category}: illustrative technology composition`,
  label: "Sample article",
  featured: index === 0,
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
