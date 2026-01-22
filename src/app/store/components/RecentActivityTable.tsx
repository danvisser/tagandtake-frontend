"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"

import { Button } from "@src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table"
import Image from "next/image"
import { getImageUrl, parseApiDate } from "@src/lib/utils"
import {
  getStoreEventLogs,
  ListingEventType,
  type ListingEventLog,
} from "@src/api/listingsApi"

// Only allow filtering/querying the event types we care about.
const QUERYABLE_EVENT_TYPES: ListingEventType[] = [
  ListingEventType.LISTING_CREATED,
  ListingEventType.LISTING_RECALLED,
  ListingEventType.LISTING_DELISTED,
  ListingEventType.LISTING_COLLECTED,
  ListingEventType.LISTING_ABANDONED,
  ListingEventType.LISTING_SOLD,
  ListingEventType.TAG_REPLACED,
  ListingEventType.TAG_REMOVED,
]

function eventTypeLabel(et: ListingEventType) {
  return et
    .split("_")
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ")
}

function formatDateTime(dateString: string) {
  const d = parseApiDate(dateString)
  if (!d) return dateString
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

function getItemImageUrl(log: ListingEventLog): string | null {
  const item = log.item_details
  if (!item) return null

  if (typeof item.main_image === "string" && item.main_image) return item.main_image
  const first = item.images?.[0]?.image_url
  return first ?? null
}

export function RecentActivityTable() {
  // Filter UX:
  // - Default is "all" (all queryable types selected)
  // - User can toggle checkboxes while menu is open (no network)
  // - We commit + re-query when the dropdown closes
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [selectedEventTypes, setSelectedEventTypes] = React.useState<ListingEventType[]>(
    QUERYABLE_EVENT_TYPES
  )
  const [draftEventTypes, setDraftEventTypes] = React.useState<ListingEventType[]>(
    QUERYABLE_EVENT_TYPES
  )
  const [itemFilterId, setItemFilterId] = React.useState<number | null>(null)
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [logs, setLogs] = React.useState<ListingEventLog[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [cacheBust] = React.useState(() => Date.now())

  const filterLabel = React.useMemo(() => {
    if (!selectedEventTypes.length) return "No events"
    if (selectedEventTypes.length === QUERYABLE_EVENT_TYPES.length) return "All"
    if (selectedEventTypes.length === 1) return eventTypeLabel(selectedEventTypes[0])
    return `${selectedEventTypes.length} events`
  }, [selectedEventTypes])

  React.useEffect(() => {
    let cancelled = false

    const load = async () => {
      // When filtering by item, show all event types for that item
      // Otherwise, respect the selected event type filters
      const eventTypesToUse = itemFilterId ? QUERYABLE_EVENT_TYPES : selectedEventTypes

      if (eventTypesToUse.length === 0) {
        setLogs([])
        setTotalPages(1)
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      const res = await getStoreEventLogs({
        page,
        eventTypes: eventTypesToUse,
        itemId: itemFilterId ?? undefined,
      })

      if (cancelled) return

      if (!res.success || !res.data) {
        setLogs([])
        setTotalPages(1)
        setError(res.error ?? "Failed to load activity")
        setLoading(false)
        return
      }

      setLogs(res.data.results)
      setTotalPages(res.data.total_pages || 1)
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [selectedEventTypes, itemFilterId, page])

  const columns = React.useMemo<ColumnDef<ListingEventLog>[]>(() => {
    return [
      {
        id: "image",
        header: "",
        cell: ({ row }) => {
          const url = getItemImageUrl(row.original)
          const name = row.original.item_details?.name ?? "Item"
          return (
            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
              {url ? (
                <Image
                  src={getImageUrl(url, cacheBust)}
                  alt={name}
                  fill
                  sizes="40px"
                  className="object-cover"
                  unoptimized
                />
              ) : null}
            </div>
          )
        },
      },
      {
        accessorKey: "event_type_display",
        header: "Update",
        cell: ({ row }) => (
          <div className="font-medium truncate">
            {row.getValue("event_type_display") as string}
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => {
          const raw = row.getValue("created_at") as string
          return (
            <div className="whitespace-nowrap text-muted-foreground">
              {formatDateTime(raw)}
            </div>
          )
        },
      },
      {
        accessorKey: "item",
        header: "Item",
        cell: ({ row }) => {
          const id = row.getValue("item") as number
          const active = itemFilterId === id
          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs whitespace-nowrap border-black/10 text-muted-foreground hover:bg-black/5 hover:text-foreground"
              onClick={() => {
                setPage(1)
                setItemFilterId((prev) => (prev === id ? null : id))
              }}
            >
              {active ? "Clear filter" : "Item history"}
            </Button>
          )
        },
      },
    ]
  }, [cacheBust, itemFilterId])

  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // server-pagination; render current page only
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <DropdownMenu
            open={filterOpen}
            onOpenChange={(open) => {
              setFilterOpen(open)
              if (open) {
                // Reset draft to current selection each time menu opens.
                setDraftEventTypes(selectedEventTypes)
                return
              }
              // Commit selection when menu closes, then re-query.
              // Only update if draftEventTypes is different and not empty to avoid clearing filters
              if (draftEventTypes.length > 0 && JSON.stringify(draftEventTypes) !== JSON.stringify(selectedEventTypes)) {
                setPage(1)
                setSelectedEventTypes(draftEventTypes)
              }
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="border-black/10 text-muted-foreground hover:bg-black/5"
              >
                <span className="text-muted-foreground">Filter:</span>{" "}
                <span className="text-muted-foreground">{filterLabel}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel>Event types</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={draftEventTypes.length === QUERYABLE_EVENT_TYPES.length}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(checked) => {
                  setDraftEventTypes(checked ? QUERYABLE_EVENT_TYPES : [])
                }}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              {QUERYABLE_EVENT_TYPES.map((t) => (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={draftEventTypes.includes(t)}
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={(checked) => {
                    setDraftEventTypes((prev) => {
                      if (checked) return Array.from(new Set([...prev, t]))
                      return prev.filter((x) => x !== t)
                    })
                  }}
                >
                  {eventTypeLabel(t)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-xs text-muted-foreground">
          {loading ? "Loading…" : error ? error : `Page ${page} of ${totalPages}`}
        </div>
      </div>

      {/* Mobile: stacked list (prevents horizontal overflow) */}
      <div className="sm:hidden">
        <div className="overflow-hidden rounded-md border border-black/10 dark:border-white/10">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading activity…</div>
          ) : logs.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              {error ? error : "No recent activity."}
            </div>
          ) : (
            <div className="divide-y divide-black/10 dark:divide-white/10">
              {logs.map((e) => {
                const img = getItemImageUrl(e)
                return (
                  <div key={e.id} className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        {img ? (
                          <Image
                            src={getImageUrl(img, cacheBust)}
                            alt={e.item_details?.name ?? "Item"}
                            fill
                            sizes="40px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{e.event_type_display}</div>
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDateTime(e.created_at)}
                          </div>
                        </div>
                        <div className="mt-1 flex justify-end">
                          {(() => {
                            const active = itemFilterId === e.item
                            return (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs border-black/10 text-muted-foreground hover:bg-black/5 hover:text-foreground"
                                onClick={() => {
                                  setPage(1)
                                  setItemFilterId((prev) => (prev === e.item ? null : e.item))
                                }}
                              >
                                {active ? "Clear filter" : "Item history"}
                              </Button>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Desktop/tablet: shadcn table */}
      <div className="hidden sm:block">
        <div className="overflow-hidden rounded-md border border-black/10 dark:border-white/10">
          <Table className="table-fixed dark:[&_tr]:border-white/10 [&_tr]:border-black/10">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={header.id === "image" ? "w-12" : undefined}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    Loading activity…
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={cell.column.id === "image" ? "w-12" : undefined}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {error ? error : "No recent activity."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

