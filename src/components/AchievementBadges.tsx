import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Pencil } from "lucide-react";

export interface AchievementBadge {
  id: string;
  text: string;
  color: string;
}

const STORAGE_KEY = "portfolio_achievement_badges";

const colorOptions = [
  { name: "Blue", value: "bg-blue-500 hover:bg-blue-600" },
  { name: "Purple", value: "bg-purple-500 hover:bg-purple-600" },
  { name: "Pink", value: "bg-pink-500 hover:bg-pink-600" },
  { name: "Green", value: "bg-green-500 hover:bg-green-600" },
  { name: "Orange", value: "bg-orange-500 hover:bg-orange-600" },
  { name: "Red", value: "bg-red-500 hover:bg-red-600" },
  { name: "Teal", value: "bg-teal-500 hover:bg-teal-600" },
  { name: "Indigo", value: "bg-indigo-500 hover:bg-indigo-600" },
  { name: "Yellow", value: "bg-yellow-500 hover:bg-yellow-600" },
  { name: "Emerald", value: "bg-emerald-500 hover:bg-emerald-600" },
];

const defaultBadges: AchievementBadge[] = [
  { id: "badge-1", text: "Top 1% Coder", color: "bg-purple-500 hover:bg-purple-600" },
  { id: "badge-2", text: "CFA Level 1", color: "bg-blue-500 hover:bg-blue-600" },
  { id: "badge-3", text: "AWS Certified", color: "bg-orange-500 hover:bg-orange-600" },
];

export const AchievementBadges = () => {
  const [badges, setBadges] = useState<AchievementBadge[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<AchievementBadge | null>(null);
  const [formText, setFormText] = useState("");
  const [formColor, setFormColor] = useState(colorOptions[0].value);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBadges(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse badges:", error);
        setBadges(defaultBadges);
      }
    } else {
      setBadges(defaultBadges);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
  }, [badges]);

  const handleAdd = () => {
    setEditingBadge(null);
    setFormText("");
    setFormColor(colorOptions[0].value);
    setDialogOpen(true);
  };

  const handleEdit = (badge: AchievementBadge) => {
    setEditingBadge(badge);
    setFormText(badge.text);
    setFormColor(badge.color);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBadges(badges.filter((b) => b.id !== id));
  };

  const handleSave = () => {
    if (!formText.trim()) return;

    if (editingBadge) {
      setBadges(
        badges.map((b) =>
          b.id === editingBadge.id
            ? { ...b, text: formText.trim(), color: formColor }
            : b
        )
      );
    } else {
      setBadges([
        ...badges,
        {
          id: Date.now().toString(),
          text: formText.trim(),
          color: formColor,
        },
      ]);
    }

    setDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        {badges.map((badge) => (
          <div key={badge.id} className="group relative">
            <Badge
              className={`${badge.color} text-white border-0 px-4 py-2 text-sm font-semibold transition-all cursor-pointer shadow-md`}
            >
              {badge.text}
            </Badge>
            <div className="absolute top-0 right-0 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={() => handleEdit(badge)}
                className="bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDelete(badge.id)}
                className="bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="gap-1 h-8"
        >
          <Plus className="w-3 h-3" />
          Add Badge
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBadge ? "Edit" : "Add"} Achievement Badge
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="badge-text">Badge Text</Label>
              <Input
                id="badge-text"
                placeholder="e.g. CFA Level 1, Top 1% Coder"
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Badge Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormColor(color.value)}
                    className={`h-12 rounded-md ${color.value} ${
                      formColor === color.value
                        ? "ring-2 ring-offset-2 ring-primary"
                        : ""
                    } transition-all`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preview</Label>
              <Badge
                className={`${formColor} text-white border-0 px-4 py-2 text-sm font-semibold`}
              >
                {formText || "Preview"}
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formText.trim()}>
              {editingBadge ? "Save Changes" : "Add Badge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
