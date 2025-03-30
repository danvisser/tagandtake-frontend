import { ReactNode } from "react";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";

interface ListingStoryProps {
  title: string;
  price: number;
  condition: string;
  category: string;
  images: { image_url: string; order: number }[];
  statusBadge?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  statusMessage?: string;
  footerContent?: ReactNode;
}

export function ListingStory({
  title,
  price,
  condition,
  category,
  images,
  statusBadge,
  statusMessage,
  footerContent,
}: ListingStoryProps) {
  return (
    <ListingCard
      title={title}
      price={price}
      condition={condition}
      category={category}
      images={images}
      statusBadge={statusBadge}
      statusMessage={statusMessage}
      footerContent={footerContent}
    />
  );
}
