"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ProgramFormat } from "@/data/programs";

export function ProgramSyllabusAccordion({
  formats,
}: {
  formats: ProgramFormat[];
}) {
  const categories = [...new Set(formats.map(({ category }) => category))];
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [openDurations, setOpenDurations] = useState<Set<string>>(new Set());

  function toggleCategory(category: string) {
    setOpenCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function toggleDuration(id: string) {
    setOpenDurations((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="program-accordion">
      {categories.map((category, categoryIndex) => {
        const categoryId = `syllabus-${categoryIndex}`;
        const panelId = `${categoryId}-panel`;
        const isOpen = openCategories.has(category);
        const categoryFormats = formats.filter(
          (format) => format.category === category,
        );

        return (
          <section className="program-accordion-category" key={category}>
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="program-accordion-category-toggle"
                id={categoryId}
                onClick={() => toggleCategory(category)}
                type="button"
              >
                <span>{category}</span>
                <ChevronDown aria-hidden="true" size={21} />
              </button>
            </h3>
            <div
              className="program-accordion-category-panel"
              hidden={!isOpen}
              id={panelId}
            >
              {categoryFormats.map((format) => {
                const durationPanelId = `${format.id}-panel`;
                const durationIsOpen = openDurations.has(format.id);

                return (
                  <section
                    className="program-accordion-duration"
                    key={format.id}
                  >
                    <h4>
                      <button
                        aria-controls={durationPanelId}
                        aria-expanded={durationIsOpen}
                        className="program-accordion-duration-toggle"
                        onClick={() => toggleDuration(format.id)}
                        type="button"
                      >
                        <span>
                          <strong>{format.duration}</strong>
                          <span className="program-format-description">
                            {format.description}
                          </span>
                        </span>
                        <ChevronDown aria-hidden="true" size={19} />
                      </button>
                    </h4>
                    <div
                      className="program-accordion-duration-panel"
                      hidden={!durationIsOpen}
                      id={durationPanelId}
                    >
                      {format.modules.map((module) => (
                        <article
                          className="program-syllabus-module"
                          key={module.title}
                        >
                          <h5>{module.title}</h5>
                          <ul>
                            {module.topics.map((topic) => (
                              <li key={topic}>{topic}</li>
                            ))}
                          </ul>
                          {module.activity && (
                            <p className="program-module-note">
                              <strong>Practical activity:</strong>{" "}
                              {module.activity}
                            </p>
                          )}
                          {module.deliverable && (
                            <p className="program-module-note">
                              <strong>Deliverable:</strong> {module.deliverable}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
