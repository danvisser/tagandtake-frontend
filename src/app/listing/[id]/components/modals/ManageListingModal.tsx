"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import LoadingSpinner from "@src/components/LoadingSpinner";
import {
  getListingRemovalReasonsByType,
} from "@src/data/recallReasonsData";
import { ListingRemovalReasonType } from "@src/api/listingsApi";
import { RotateCcw, X, RefreshCw, AlertTriangle, Store, User, Tag } from "lucide-react";

interface ManageListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reasonId: number) => Promise<void>;
  onReplaceTag: (newTagId: number) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  pastMinListingDays: boolean;
}

type ActionType = "recall" | "delist" | "replace_tag" | null;

export default function ManageListingModal({
  isOpen,
  onClose,
  onConfirm,
  onReplaceTag,
  isLoading,
  error,
  pastMinListingDays,
}: ManageListingModalProps) {
  const [selectedAction, setSelectedAction] = React.useState<ActionType>(null);
  const [selectedReasonId, setSelectedReasonId] = React.useState<number | null>(
    null
  );
  const [newTagId, setNewTagId] = React.useState<string>("");

  // Get reasons by type
  const issueReasons = getListingRemovalReasonsByType(ListingRemovalReasonType.ISSUE);
  const storeDiscretionReasons = getListingRemovalReasonsByType(
    ListingRemovalReasonType.STORE_DISCRETION
  );
  const ownerRequestReasons = getListingRemovalReasonsByType(
    ListingRemovalReasonType.OWNER_REQUEST
  );
  const tagErrorReasons = getListingRemovalReasonsByType(ListingRemovalReasonType.TAG_ERROR);

  const handleConfirm = async () => {
    if (selectedAction === "replace_tag") {
      const tagId = parseInt(newTagId);
      if (!tagId || isNaN(tagId)) {
        return;
      }
      await onReplaceTag(tagId);
    } else {
      if (!selectedReasonId) {
        return;
      }
      await onConfirm(selectedReasonId);
    }
  };

  const handleClose = () => {
    setSelectedAction(null);
    setSelectedReasonId(null);
    setNewTagId("");
    onClose();
  };

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
    setSelectedReasonId(null); // Reset reason selection when changing action
  };

  const renderContent = () => {
    if (!selectedAction) {
      return (
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleActionSelect("recall")}
            className="w-full justify-start text-left h-auto py-4 px-4 border-destructive bg-white text-destructive hover:bg-destructive hover:text-white active:bg-destructive active:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <div className="font-medium text-lg">Recall</div>
              </div>
            </div>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleActionSelect("delist")}
            className="w-full justify-start text-left h-auto py-4 px-4 border-foreground bg-white text-foreground hover:bg-foreground hover:text-background active:bg-foreground active:text-background transition-colors"
          >
            <div className="flex items-center gap-3">
              <X className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <div className="font-medium text-lg">Delist</div>
              </div>
            </div>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleActionSelect("replace_tag")}
            className="w-full justify-start text-left h-auto py-4 px-4 border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground active:bg-primary active:text-primary-foreground transition-colors"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <div className="font-medium text-lg">Replace Tag</div>
              </div>
            </div>
          </Button>
        </div>
      );
    }

    if (selectedAction === "recall") {
      return (
        <div className="space-y-4">
          {/* Store Discretion - always visible but disabled if past_min_listing_days is false */}
          {storeDiscretionReasons.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Store Discretion</p>
              </div>
              <div className="space-y-2">
                {storeDiscretionReasons.map((reason) => (
                  <div key={reason.id} className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (pastMinListingDays) {
                          setSelectedReasonId(reason.id);
                        }
                      }}
                      disabled={!pastMinListingDays}
                      className={`w-full flex justify-start text-left h-auto py-3 px-4 border-destructive whitespace-normal ${selectedReasonId === reason.id
                        ? "bg-destructive text-white"
                        : "bg-white text-destructive hover:bg-destructive hover:text-white"
                        } ${!pastMinListingDays ? "opacity-50 cursor-not-allowed" : ""
                        } transition-colors`}
                    >
                      <div className="flex flex-col items-start w-full min-w-0 text-left">
                        <div className="font-medium break-words w-full text-left">{reason.description}</div>
                      </div>
                    </Button>
                    {!pastMinListingDays && (
                      <div className="mt-1 px-1">
                        <p className="text-xs text-muted-foreground italic">
                          Not available until the display period guarantee has passed
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issue Reasons */}
          {issueReasons.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Issues</p>
              </div>
              <div className="space-y-2">
                {issueReasons.map((reason) => (
                  <Button
                    key={reason.id}
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedReasonId(reason.id)}
                    className={`w-full flex justify-start text-left h-auto py-3 px-4 border-destructive whitespace-normal ${selectedReasonId === reason.id
                      ? "bg-destructive text-white"
                      : "bg-white text-destructive hover:bg-destructive hover:text-white"
                      } transition-colors`}
                  >
                    <div className="flex flex-col items-start w-full min-w-0 text-left">
                      <div className="font-medium break-words w-full text-left">{reason.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedAction === "delist") {
      return (
        <div className="space-y-4">
          {/* Owner Request */}
          {ownerRequestReasons.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Owner Request</p>
              </div>
              <div className="space-y-2">
                {ownerRequestReasons.map((reason) => (
                  <Button
                    key={reason.id}
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedReasonId(reason.id)}
                    className={`w-full flex justify-start text-left h-auto py-3 px-4 border-foreground whitespace-normal ${selectedReasonId === reason.id
                      ? "bg-foreground text-background"
                      : "bg-white text-foreground hover:bg-foreground hover:text-background"
                      } transition-colors`}
                  >
                    <div className="flex flex-col items-start w-full min-w-0 text-left">
                      <div className="font-medium break-words w-full text-left">{reason.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Tag Error */}
          {tagErrorReasons.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Tag Error</p>
              </div>
              <div className="space-y-2">
                {tagErrorReasons.map((reason) => (
                  <Button
                    key={reason.id}
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedReasonId(reason.id)}
                    className={`w-full flex justify-start text-left h-auto py-3 px-4 border-foreground whitespace-normal ${selectedReasonId === reason.id
                      ? "bg-foreground text-background"
                      : "bg-white text-foreground hover:bg-foreground hover:text-background"
                      } transition-colors`}
                  >
                    <div className="flex flex-col items-start w-full min-w-0 text-left">
                      <div className="font-medium break-words w-full text-left">{reason.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedAction === "replace_tag") {
      return (
        <div className="space-y-6 py-2">
          <p className="text-sm text-muted-foreground">
            Enter the ID of the new tag.
          </p>
          <Input
            id="new-tag-id"
            type="number"
            placeholder="New Tag ID"
            value={newTagId}
            onChange={(e) => setNewTagId(e.target.value)}
            className="w-full text-base font-medium"
          />
        </div>
      );
    }

    return null;
  };

  const getTitle = () => {
    if (selectedAction === "recall") return "Recall Listing";
    if (selectedAction === "delist") return "Delist Listing";
    if (selectedAction === "replace_tag") return "Replace Tag";
    return "Manage Listing";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="px-0">
          <DialogTitle className="text-xl font-medium">{getTitle()}</DialogTitle>
        </DialogHeader>

        {selectedAction && (
          <div className="pb-1 flex-shrink-0 -mt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleActionSelect(null)}
              className="text-base"
            >
              ← Back
            </Button>
          </div>
        )}

        <div className="py-4 space-y-4 max-h-[400px] overflow-y-auto">
          {renderContent()}
        </div>

        {error && (
          <div className="py-2">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={
              isLoading ||
              !selectedAction ||
              (selectedAction === "replace_tag"
                ? !newTagId || isNaN(parseInt(newTagId))
                : !selectedReasonId)
            }
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" text="Processing..." />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
