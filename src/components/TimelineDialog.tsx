import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TimelineEntry } from './Timeline';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  date: z.string().min(1, 'Date is required'),
  tag: z.enum(['learning', 'building', 'completed', 'achievement', 'work']),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface TimelineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: TimelineEntry) => void;
  entry?: TimelineEntry | null;
}

export function TimelineDialog({ open, onOpenChange, onSave, entry }: TimelineDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      date: '',
      tag: 'completed',
      description: '',
      link: '',
    },
  });

  useEffect(() => {
    if (entry) {
      form.reset({
        title: entry.title,
        date: entry.date,
        tag: entry.tag,
        description: entry.description,
        link: entry.link || '',
      });
    } else {
      form.reset({
        title: '',
        date: '',
        tag: 'completed',
        description: '',
        link: '',
      });
    }
  }, [entry, form]);

  const onSubmit = (values: FormValues) => {
    const timelineEntry: TimelineEntry = {
      id: entry?.id || crypto.randomUUID(),
      title: values.title,
      date: values.date,
      tag: values.tag,
      description: values.description,
      link: values.link || undefined,
    };
    onSave(timelineEntry);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{entry ? 'Edit Timeline Entry' : 'Add Timeline Entry'}</DialogTitle>
          <DialogDescription>
            {entry ? 'Update your timeline entry details' : 'Add a new entry to your timeline'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Finished CFA Level 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tag" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="learning">📚 Learning</SelectItem>
                        <SelectItem value="building">🚀 Building</SelectItem>
                        <SelectItem value="completed">✅ Completed</SelectItem>
                        <SelectItem value="achievement">🏆 Achievement</SelectItem>
                        <SelectItem value="work">💼 Work</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you accomplished or what you're working on..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="url" 
                      placeholder="https://example.com/certificate" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {entry ? 'Update Entry' : 'Add Entry'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
