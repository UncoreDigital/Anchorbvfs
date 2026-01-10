import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageUpload } from "@/components/ui/ImageUpload";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional().or(z.literal("")),
  location: z.string().min(1, "Location is required"),
  presenters: z.string().min(1, "Presenters are required"),
  description: z.string().min(1, "Description is required"),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  image_url: z.string().optional().or(z.literal("")),
});

type EventFormValues = z.infer<typeof eventSchema>;

const EventEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditing = id && id !== "new";

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    if (isEditing) {
      const fetchEvent = async () => {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          toast.error("Error fetching event");
          navigate("/admin/events");
          return;
        }

        if (data) {
          reset({
            title: data.title,
            date: data.date,
            time: data.time || "",
            location: data.location,
            presenters: Array.isArray(data.presenters)
              ? data.presenters.join(", ")
              : data.presenters,
            description: data.description,
            link: data.link || "",
            image_url: data.image_url,
          });
        }
      };

      fetchEvent();
    }
  }, [id, isEditing, navigate, reset]);

  const onSubmit = async (data: EventFormValues) => {
    setLoading(true);

    const presentersArray = data.presenters
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const eventData = {
      title: data.title,
      date: data.date,
      time: data.time || null,
      location: data.location,
      presenters: presentersArray,
      description: data.description,
      link: data.link || null,
      image_url: data.image_url || null,
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Event updated successfully");
      } else {
        const { error } = await supabase.from("events").insert([eventData]);

        if (error) throw error;
        toast.success("Event created successfully");
      }
      navigate("/admin/events");
    } catch (error: any) {
      toast.error("Error saving event: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-playfair font-bold text-gray-900">
            {isEditing ? "Edit Event" : "Create New Event"}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <Controller
              name="image_url"
              control={control}
              render={({ field }) => (
                <ImageUpload value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter event title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date Display</Label>
              <Input
                id="date"
                {...register("date")}
                placeholder="e.g. October 8, 2025"
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                {...register("time")}
                placeholder="e.g. 11 a.m. – 1 p.m. EST"
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Virtual or Physical Address"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="presenters">Presenters (comma separated)</Label>
            <Input
              id="presenters"
              {...register("presenters")}
              placeholder="Trisch Garthoeffner, Greg Caruso"
            />
            {errors.presenters && (
              <p className="text-red-500 text-sm">
                {errors.presenters.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Registration/Details Link (Optional)</Label>
            <Input id="link" {...register("link")} placeholder="https://..." />
            {errors.link && (
              <p className="text-red-500 text-sm">{errors.link.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link to="/admin/events">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Event"
                : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditor;
