"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EditUserDialog({ user, isOpen, onOpenChange }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {user?.name}`s Info</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="status">Account Status</label>
            <select id="status" className="w-full border p-2 rounded-md">
              <option value="enabled">Enable</option>
              <option value="disabled">Disable</option>
            </select>
          </div>
          <div>
            <label htmlFor="manualAccessCode">Manual Access Code</label>
            <input
              id="manualAccessCode"
              type="text"
              placeholder="bKash TrxID ID"
              className="w-full border p-2 rounded-md"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="danger"
            onClick={() => onOpenChange(false)}
            className="bg-red-600 text-white"
          >
            Cancel
          </Button>
          <Button variant="primary" className="bg-green-700 text-white">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
