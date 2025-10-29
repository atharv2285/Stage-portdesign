import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { TimelineDialog } from './TimelineDialog';
import { useTimelineStorage } from '@/hooks/useTimelineStorage';
import { toast } from '@/hooks/use-toast';

export interface TimelineEntry {
  id: string;
  title: string;
  date: string; // ISO date string or "Ongoing"
  tag: 'learning' | 'building' | 'completed' | 'achievement' | 'work';
  description: string;
  link?: string;
}

const tagVariants: Record<TimelineEntry['tag'], { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  learning: { label: '📚 Learning', variant: 'secondary' },
  building: { label: '🚀 Building', variant: 'default' },
  completed: { label: '✅ Completed', variant: 'outline' },
  achievement: { label: '🏆 Achievement', variant: 'default' },
  work: { label: '💼 Work', variant: 'secondary' },
};

export function Timeline() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimelineEntry | null>(null);
  const { entries, addEntry, updateEntry, deleteEntry } = useTimelineStorage();

  const handleAdd = () => {
    setEditingEntry(null);
    setDialogOpen(true);
  };

  const handleEdit = (entry: TimelineEntry) => {
    setEditingEntry(entry);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
    toast({
      title: "Timeline entry deleted",
      description: "The entry has been removed from your timeline.",
    });
  };

  const handleSave = (entry: TimelineEntry) => {
    if (editingEntry) {
      updateEntry(entry.id, entry);
      toast({
        title: "Timeline updated",
        description: "Your timeline entry has been updated successfully.",
      });
    } else {
      addEntry(entry);
      toast({
        title: "Timeline entry added",
        description: "New entry has been added to your timeline.",
      });
    }
    setDialogOpen(false);
  };

  const formatDate = (dateStr: string) => {
    if (dateStr === 'Ongoing') return 'Ongoing';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Timeline</h2>
          <p className="text-muted-foreground mt-1">Track your journey and achievements</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Update
        </Button>
      </div>

      {entries.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No timeline entries yet</h3>
          <p className="text-muted-foreground mb-6">
            Start tracking your journey by adding your first timeline entry
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Entry
          </Button>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-6 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {entries.map((entry, index) => (
              <div key={entry.id} className="relative flex gap-6 group">
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                </div>

                {/* Content */}
                <Card className="flex-1 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{entry.title}</h3>
                        <Badge variant={tagVariants[entry.tag].variant}>
                          {tagVariants[entry.tag].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        {formatDate(entry.date)}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{entry.description}</p>
                  
                  {entry.link && (
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      View more
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      <TimelineDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        entry={editingEntry}
      />
    </div>
  );
}
