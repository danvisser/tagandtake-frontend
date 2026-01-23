"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import { Input } from "@src/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@src/components/ui/accordion";
import { Search, ChevronRight, Package, RotateCcw, CreditCard, Settings } from "lucide-react";
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
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);

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
            const descriptionMatch = typeof subSection.description === "string"
              ? subSection.description.toLowerCase().includes(term)
              : false;
            const contentMatch = typeof subSection.content === "string"
              ? subSection.content.toLowerCase().includes(term)
              : false;
            const stepsMatch =
              subSection.steps?.some((step) =>
                typeof step.text === "string" && step.text.toLowerCase().includes(term)
              ) ?? false;

            if (subTitleMatch || descriptionMatch || contentMatch || stepsMatch) {
              // If any step matches, show all steps in the subsection
              return {
                ...subSection,
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

  // Update open accordion items when searching
  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setOpenAccordionItems([]); // Close all when no search
      return;
    }
    // Open all matching accordion items when searching
    const items: string[] = [];
    filteredSections.forEach((section) => {
      section.subSections.forEach((subSection) => {
        const itemId = `${section.title}-${subSection.title}`.toLowerCase().replace(/\s+/g, "-");
        items.push(itemId);
      });
    });
    setOpenAccordionItems(items);
  }, [searchTerm, filteredSections]);

  const highlightText = (text: string | React.ReactNode, searchTerm: string, inline: boolean = false) => {
    // If it's a React node, return as-is (can't highlight)
    if (typeof text !== "string") {
      return text;
    }

    if (!searchTerm.trim()) {
      return text;
    }

    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedTerm})`, "gi");
    const parts = text.split(regex);

    const content = (
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

    // Wrap in span for inline contexts (like titles) to preserve flex layout
    return inline ? <span>{content}</span> : content;
  };

  const scrollToSection = (sectionTitle: string) => {
    const id = sectionTitle.toLowerCase().replace(/\s+/g, "-");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // Small delay to ensure accordion is expanded if needed
      setTimeout(() => {
        const accordionTrigger = element.querySelector('[data-state="closed"]');
        if (accordionTrigger) {
          (accordionTrigger as HTMLElement).click();
        }
      }, 100);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="mb-4">
        <h1 className="text-3xl font-normal leading-8">Help Center</h1>
      </div>

      {/* Quick Links */}
      <div className="mb-6 space-y-2">
        {memberHelpContent.map((section) => {
          const getIcon = () => {
            switch (section.title) {
              case "Selling basics":
                return <Package className="h-4 w-4" />;
              case "Item recalls":
                return <RotateCcw className="h-4 w-4" />;
              case "Payment and withdrawals":
                return <CreditCard className="h-4 w-4" />;
              case "Account and settings":
                return <Settings className="h-4 w-4" />;
              default:
                return null;
            }
          };

          return (
            <button
              key={section.title}
              onClick={() => scrollToSection(section.title)}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              {getIcon()}
              <span>{section.title}</span>
              <ChevronRight className="h-4 w-4 ml-auto" />
            </button>
          );
        })}
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
            <Card
              key={section.title}
              id={section.title.toLowerCase().replace(/\s+/g, "-")}
              className="overflow-hidden scroll-mt-4"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  {(() => {
                    switch (section.title) {
                      case "Selling basics":
                        return <Package className="h-5 w-5 text-muted-foreground" />;
                      case "Item recalls":
                        return <RotateCcw className="h-5 w-5 text-muted-foreground" />;
                      case "Payment and withdrawals":
                        return <CreditCard className="h-5 w-5 text-muted-foreground" />;
                      case "Account and settings":
                        return <Settings className="h-5 w-5 text-muted-foreground" />;
                      default:
                        return null;
                    }
                  })()}
                  {highlightText(section.title, searchTerm, true)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion
                  type="multiple"
                  className="w-full"
                  value={openAccordionItems}
                  onValueChange={setOpenAccordionItems}
                >
                  {section.subSections.map((subSection) => {
                    const itemId = `${section.title}-${subSection.title}`.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <AccordionItem key={subSection.title} value={itemId}>
                        <AccordionTrigger className="text-base">
                          {highlightText(subSection.title, searchTerm)}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {subSection.description && (
                              <p className="text-sm text-muted-foreground">
                                {highlightText(subSection.description, searchTerm)}
                              </p>
                            )}

                            {subSection.content && (
                              <p className="text-sm text-muted-foreground">
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
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
