import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  published_at: z.string().min(1, "Date display text is required"),
  link: z.string().url("Must be a valid URL"),
  image_url: z.string().optional().or(z.literal("")),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditing = id && id !== "new";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      type: "Article",
      published_at: new Date().toISOString().split("T")[0],
    },
  });

  const type = watch("type");

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    // If it's an ISO string or YYYY-MM-DD
    if (dateStr.includes("T")) {
      return dateStr.split("T")[0];
    }
    // If it's DD-MM-YYYY
    const parts = dateStr.split("-");
    if (parts.length === 3 && parts[0].length === 2) {
      const [d, m, y] = parts;
      return `${y}-${m}-${d}`;
    }
    return dateStr;
  };

  const formatDateForStorage = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3 && parts[2].length === 4) {
      const [d, m, y] = parts;
      return `${y}-${m}-${d}`;
    }
    return dateStr;
  };

  useEffect(() => {
    if (isEditing) {
      const fetchArticle = async () => {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          toast.error("Error fetching article");
          navigate("/admin/articles");
          return;
        }

        if (data) {
          reset({
            title: data.title,
            type: data.type,
            published_at: formatDateForInput(data.published_at),
            link: data.link,
            image_url: data.image_url,
          });
        }
      };

      fetchArticle();
    }
  }, [id, isEditing, navigate, reset]);

  const onSubmit = async (data: ArticleFormValues) => {
    setLoading(true);
    try {
      const formattedData = {
        title: data.title,
        type: data.type,
        published_at: formatDateForStorage(data.published_at),
        link: data.link,
        image_url: data.image_url,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("articles")
          .update(formattedData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Updated successfully");
      } else {
        const { error } = await supabase
          .from("articles")
          .insert([formattedData]);

        if (error) throw error;
        toast.success("Created successfully");
      }
      navigate("/admin/articles");
    } catch (error: any) {
      toast.error("Error saving: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/articles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-playfair font-bold text-gray-900">
            {isEditing ? "Edit Item" : "Add New Item"}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(val) => setValue("type", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Article">Article</SelectItem>
                  <SelectItem value="Podcast">Podcast</SelectItem>
                  <SelectItem value="Story">Story</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-4 flex flex-col">
              <Label htmlFor="published_at">Date Display</Label>
              <Controller
                name="published_at"
                control={control}
                render={({ field }) => {
                  let dateValue: Date | undefined;
                  if (field.value) {
                    if (field.value.includes("-")) {
                      const parts = field.value.split("-");
                      if (parts.length === 3) {
                        const [d, m, y] =
                          parts[0].length === 4
                            ? [parts[2], parts[1], parts[0]] // YYYY-MM-DD
                            : [parts[0], parts[1], parts[2]]; // DD-MM-YYYY

                        // Construct date in local time (months are 0-indexed)
                        dateValue = new Date(
                          parseInt(y),
                          parseInt(m) - 1,
                          parseInt(d)
                        );
                      }
                    }
                  }

                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {dateValue ? (
                            format(dateValue, "dd-MM-yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateValue}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(format(date, "dd-MM-yyyy"));
                            } else {
                              field.onChange("");
                            }
                          }}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  );
                }}
              />
              {errors.published_at && (
                <p className="text-red-500 text-sm">
                  {errors.published_at.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link URL</Label>
            <Input id="link" {...register("link")} placeholder="https://..." />
            {errors.link && (
              <p className="text-red-500 text-sm">{errors.link.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link to="/admin/articles">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleEditor;
