"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminTagInput } from "@/components/admin/admin-tag-input";
import {
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "@/lib/actions/admin/warehouses";
import type {
  WarehouseFormData,
  WarehouseUpdateData,
} from "@/lib/validation/warehouse";
import type { ActionResult } from "@/lib/actions/admin/_result";

export interface WarehouseEntry {
  id: string;
  city: string;
  address: string | null;
  sqft: number | null;
  hours: string | null;
  services: string[];
  is_primary: boolean;
}

// Injectable actions so the same manager serves both the admin edit form and
// the partner dashboard. Defaults are the admin (requireAdmin) actions, so
// existing admin usage is unchanged; the partner dashboard passes its
// ownership-scoped equivalents.
type CreateAction = (
  partnerId: string,
  input: WarehouseFormData
) => Promise<ActionResult<{ id: string }>>;
type UpdateAction = (
  id: string,
  input: WarehouseUpdateData
) => Promise<ActionResult<void>>;
type DeleteAction = (id: string) => Promise<ActionResult<void>>;

interface WarehouseManagerProps {
  partnerId: string;
  initial: WarehouseEntry[];
  onChange?: (next: WarehouseEntry[]) => void;
  createAction?: CreateAction;
  updateAction?: UpdateAction;
  deleteAction?: DeleteAction;
}

interface WarehouseDraft {
  city: string;
  address: string;
  sqft: string;
  hours: string;
  services: string[];
  isPrimary: boolean;
}

const EMPTY_WAREHOUSE: WarehouseDraft = {
  city: "",
  address: "",
  sqft: "",
  hours: "",
  services: [],
  isPrimary: false,
};

export function WarehouseManager({
  partnerId,
  initial,
  onChange,
  createAction = createWarehouse,
  updateAction = updateWarehouse,
  deleteAction = deleteWarehouse,
}: WarehouseManagerProps) {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<WarehouseEntry[]>(initial);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<WarehouseDraft>(EMPTY_WAREHOUSE);
  const [busyId, setBusyId] = useState<string | null>(null);

  function commit(next: WarehouseEntry[]) {
    setWarehouses(next);
    onChange?.(next);
  }

  async function onAdd() {
    if (!draft.city.trim()) {
      toast.error("City is required");
      return;
    }
    const r = await createAction(partnerId, {
      city: draft.city,
      address: draft.address || null,
      sqft: draft.sqft ? Number(draft.sqft) : null,
      hours: draft.hours || null,
      services: draft.services,
      isPrimary: draft.isPrimary,
    });
    if (r.success) {
      toast.success("Warehouse added");
      setAdding(false);
      setDraft(EMPTY_WAREHOUSE);
      router.refresh();
    } else {
      toast.error(r.error ?? "Failed");
    }
  }

  async function onUpdate(entry: WarehouseEntry) {
    setBusyId(entry.id);
    const r = await updateAction(entry.id, {
      city: entry.city,
      address: entry.address,
      sqft: entry.sqft,
      hours: entry.hours,
      services: entry.services,
      isPrimary: entry.is_primary,
    });
    setBusyId(null);
    if (r.success) {
      toast.success("Warehouse updated");
      router.refresh();
    } else {
      toast.error(r.error ?? "Failed");
    }
  }

  async function onDelete(entry: WarehouseEntry) {
    setBusyId(entry.id);
    const r = await deleteAction(entry.id);
    setBusyId(null);
    if (r.success) {
      toast.success("Warehouse deleted");
      commit(warehouses.filter((w) => w.id !== entry.id));
      router.refresh();
    } else {
      toast.error(r.error ?? "Failed");
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-text">Warehouses</h3>
        {!adding ? (
          <Button
            type="button"
            size="sm"
            onClick={() => setAdding(true)}
            className="bg-blue text-white hover:bg-blue-hover"
          >
            <Plus className="h-3.5 w-3.5" />
            Add warehouse
          </Button>
        ) : null}
      </div>

      {adding ? (
        <div className="mt-4 grid gap-3 rounded-lg border border-dashed border-border p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="City *"
              value={draft.city}
              onChange={(e) => setDraft({ ...draft, city: e.target.value })}
            />
            <Input
              placeholder="Address"
              value={draft.address}
              onChange={(e) => setDraft({ ...draft, address: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Square feet"
              value={draft.sqft}
              onChange={(e) => setDraft({ ...draft, sqft: e.target.value })}
            />
            <Input
              placeholder="Hours"
              value={draft.hours}
              onChange={(e) => setDraft({ ...draft, hours: e.target.value })}
            />
          </div>
          <AdminTagInput
            value={draft.services}
            onChange={(next) => setDraft({ ...draft, services: next })}
            placeholder="Services offered…"
          />
          <label className="inline-flex items-center gap-2 text-[13px] text-text-2">
            <input
              type="checkbox"
              checked={draft.isPrimary}
              onChange={(e) =>
                setDraft({ ...draft, isPrimary: e.target.checked })
              }
              className="h-4 w-4"
            />
            Primary warehouse
          </label>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAdding(false);
                setDraft(EMPTY_WAREHOUSE);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onAdd}
              className="bg-blue text-white hover:bg-blue-hover"
            >
              Add
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {warehouses.length === 0 && !adding ? (
          <p className="text-[13px] text-text-3">
            No warehouses yet. Add one to display on the public profile.
          </p>
        ) : null}
        {warehouses.map((entry) => (
          <div
            key={entry.id}
            className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-2"
          >
            <Input
              value={entry.city}
              onChange={(e) =>
                commit(
                  warehouses.map((w) =>
                    w.id === entry.id ? { ...w, city: e.target.value } : w
                  )
                )
              }
            />
            <Input
              value={entry.address ?? ""}
              placeholder="Address"
              onChange={(e) =>
                commit(
                  warehouses.map((w) =>
                    w.id === entry.id ? { ...w, address: e.target.value } : w
                  )
                )
              }
            />
            <Input
              type="number"
              value={entry.sqft ?? ""}
              placeholder="Square feet"
              onChange={(e) =>
                commit(
                  warehouses.map((w) =>
                    w.id === entry.id
                      ? {
                          ...w,
                          sqft: e.target.value ? Number(e.target.value) : null,
                        }
                      : w
                  )
                )
              }
            />
            <Input
              value={entry.hours ?? ""}
              placeholder="Hours"
              onChange={(e) =>
                commit(
                  warehouses.map((w) =>
                    w.id === entry.id ? { ...w, hours: e.target.value } : w
                  )
                )
              }
            />
            <div className="md:col-span-2">
              <AdminTagInput
                value={entry.services}
                onChange={(next) =>
                  commit(
                    warehouses.map((w) =>
                      w.id === entry.id ? { ...w, services: next } : w
                    )
                  )
                }
              />
            </div>
            <div className="flex items-center justify-between md:col-span-2">
              <label className="inline-flex items-center gap-2 text-[13px] text-text-2">
                <input
                  type="checkbox"
                  checked={entry.is_primary}
                  onChange={(e) =>
                    commit(
                      warehouses.map((w) =>
                        w.id === entry.id
                          ? { ...w, is_primary: e.target.checked }
                          : w
                      )
                    )
                  }
                  className="h-4 w-4"
                />
                Primary warehouse
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdate(entry)}
                  disabled={busyId === entry.id}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(entry)}
                  disabled={busyId === entry.id}
                  className="text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
