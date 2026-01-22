"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import { Input } from "@src/components/ui/input";
import { Search } from "lucide-react";
import { memberHelpContent, type HelpSection, type HelpSubSection } from "@src/data/memberHelpContent";

export default function MemberHelpPage() {
  return <MemberHelpContent />;
}

interface FilteredSubSection extends HelpSubSection {
  hasMatch: boolean;
}

interface FilteredSection extends HelpSection {
  subSections: FilteredSubSection[];
  hasMatch: boolean;
}

function MemberHelpContent() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSections = useMemo((): FilteredSection[] => {
    if (!searchTerm.trim()) {
      return memberHelpContent.map((section) => ({
        ...section,
        subSections: section.subSections.map((subSection) => ({
          ...subSection,
          hasMatch: true,
        })),
        hasMatch: true,
      }));
    }

    const term = searchTerm.toLowerCase();

    return memberHelpContent
      .map((section): FilteredSection | null => {
        const sectionTitleMatch = section.title.toLowerCase().includes(term);

        const filteredSubSections: FilteredSubSection[] = section.subSections
          .map((subSection): FilteredSubSection | null => {
            const subTitleMatch = subSection.title.toLowerCase().includes(term);
            const descriptionMatch = subSection.description?.toLowerCase().includes(term);
            const contentMatch = subSection.content?.toLowerCase().includes(term);
            const stepsMatch =
              subSection.steps?.some((step) => step.text.toLowerCase().includes(term)) ?? false;

            if (subTitleMatch || descriptionMatch || contentMatch || stepsMatch) {
              // If searching, filter steps to only show matching ones
              const filteredSteps = subSection.steps?.filter((step) =>
                step.text.toLowerCase().includes(term)
              );

              return {
                ...subSection,
                steps: filteredSteps && filteredSteps.length > 0 ? filteredSteps : subSection.steps,
                hasMatch: true,
              };
            }
            return null;
          })
          .filter((subSection): subSection is FilteredSubSection => subSection !== null);

        if (sectionTitleMatch || filteredSubSections.length > 0) {
          return {
            ...section,
            subSections: filteredSubSections,
            hasMatch: true,
          };
        }
        return null;
      })
      .filter((section): section is FilteredSection => section !== null);
  }, [searchTerm]);

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) {
      return text;
    }

    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedTerm})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-yellow-200 dark:bg-yellow-900">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="mb-4">
        <h1 className="text-3xl font-normal leading-8">Help Center</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search help topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredSections.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                No results found for &quot;{searchTerm}&quot;
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSections.map((section) => (
            <Card key={section.title} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{highlightText(section.title, searchTerm)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.subSections.map((subSection, subIndex) => (
                  <div
                    key={subSection.title}
                    className={`${subIndex > 0 ? "pt-4 border-t border-border" : ""}`}
                  >
                    <h3 className="font-semibold text-base mb-2 text-foreground">
                      {highlightText(subSection.title, searchTerm)}
                    </h3>

                    {subSection.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {highlightText(subSection.description, searchTerm)}
                      </p>
                    )}

                    {subSection.content && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {highlightText(subSection.content, searchTerm)}
                      </p>
                    )}

                    {subSection.steps && subSection.steps.length > 0 && (
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                        {subSection.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="pl-2">
                            {highlightText(step.text, searchTerm)}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
