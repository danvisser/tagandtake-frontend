"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { UserRoles } from "@src/types/roles";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { Routes } from "@src/constants/routes";
import { getItemById, Item, ITEM_STATUS } from "@src/api/itemsApi";
import AvailableItemCard from "./components/AvailableItemCard";
import ListedItemCard from "@src/app/member/items/[id]/components/ListedItemCard";
import RecalledItemCard from "@src/app/member/items/[id]/components/RecalledItemCard";
import SoldItemCard from "@src/app/member/items/[id]/components/SoldItemCard";
import AbandonedItemCard from "./components/AbandonedItemCard";
import EditItemModal from "./components/modals/EditItemModal";

export default function MemberItemDetailPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.MEMBER}>
      <MemberItemDetailContent />
    </AuthenticatedPage>
  );
}

function MemberItemDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getItemById(id);
        if (result.success && result.data) {
          setItem(result.data);
        } else {
          setError(result.error || "Failed to load item");
        }
      } catch (err) {
        console.error("Error loading item:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadItem();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-destructive">{error || "Item not found"}</div>
      </div>
    );
  }

  // Handle edit item
  const handleEditItem = () => {
    setIsEditModalOpen(true);
  };

  const handleItemUpdateSuccess = async () => {
    setIsEditModalOpen(false);
    setLoading(true);
    try {
      const result = await getItemById(id);
      if (result.success && result.data) {
        setItem(result.data);
        setRefreshKey(Date.now());
      } else {
        setError(result.error || "Failed to reload item");
      }
    } catch (err) {
      console.error("Error reloading item:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
    router.refresh();
  };

  // Render different card based on item status
  const status = item.status || ITEM_STATUS.AVAILABLE;
  const isListed = status === ITEM_STATUS.LISTED;

  const tabParam = searchParams.get("tab");
  const normalizeTabParam = (
    tab: string | null
  ): "in-store" | "unlisted" | "sold" | null => {
    if (tab === "at-home") return "unlisted";
    if (tab === "in-store" || tab === "unlisted" || tab === "sold") return tab;
    return null;
  };

  const tabFromStatus = (s: Item["status"]): "in-store" | "unlisted" | "sold" => {
    switch (s) {
      case ITEM_STATUS.AVAILABLE:
        return "unlisted";
      case ITEM_STATUS.SOLD:
        return "sold";
      case ITEM_STATUS.LISTED:
      case ITEM_STATUS.RECALLED:
      case ITEM_STATUS.ABANDONED:
      default:
        return "in-store";
    }
  };

  const backTab = normalizeTabParam(tabParam) ?? tabFromStatus(status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href={`${Routes.MEMBER.ITEMS.ROOT}?tab=${backTab}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to My Items
          </Link>
        </div>
        {status === ITEM_STATUS.AVAILABLE && (
          <AvailableItemCard key={refreshKey} item={item} onEditItem={handleEditItem} cacheBust={refreshKey} />
        )}
        {status === ITEM_STATUS.LISTED && (
          <ListedItemCard key={refreshKey} item={item} onEditItem={handleEditItem} cacheBust={refreshKey} />
        )}
        {status === ITEM_STATUS.RECALLED && <RecalledItemCard key={refreshKey} item={item} cacheBust={refreshKey} />}
        {status === ITEM_STATUS.SOLD && <SoldItemCard key={refreshKey} item={item} cacheBust={refreshKey} />}
        {status === ITEM_STATUS.ABANDONED && <AbandonedItemCard key={refreshKey} item={item} cacheBust={refreshKey} />}

        {/* Edit Item Modal */}
        {(status === ITEM_STATUS.AVAILABLE || status === ITEM_STATUS.LISTED) && (
          <EditItemModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            item={item}
            onSuccess={handleItemUpdateSuccess}
            disableCategoryAndCondition={isListed}
          />
        )}
      </div>
    </div>
  );
}
