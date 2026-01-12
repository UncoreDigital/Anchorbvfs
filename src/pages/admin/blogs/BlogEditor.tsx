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
import { Checkbox } from "@/components/ui/checkbox";
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

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  is_featured: z.boolean().default(false),
  published_at: z.string().min(1, "Date is required"),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditing = id && id !== "new";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      is_featured: false,
      published_at: new Date().toISOString().split("T")[0],
    },
  });

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
    if (parts[0].length === 4) {
      const [y, m, d] = parts;
      return `${d}-${m}-${y}`;
    }
    return dateStr;
  };

  useEffect(() => {
    if (isEditing) {
      const fetchBlog = async () => {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          toast.error("Error fetching blog");
          navigate("/admin/blogs");
          return;
        }

        if (data) {
          reset({
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            author: data.author,
            category: data.category,
            image_url: data.image_url,
            is_featured: data.is_featured,
            published_at: formatDateForInput(data.published_at),
          });
        }
      };

      fetchBlog();
    }
  }, [id, isEditing, navigate, reset]);

  const onSubmit = async (data: BlogFormValues) => {
    setLoading(true);
    try {
      const blogData = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        category: data.category,
        image_url: data.image_url || null,
        is_featured: data.is_featured,
        published_at: formatDateForStorage(data.published_at),
      };

      if (isEditing) {
        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Blog updated successfully");
      } else {
        const { error } = await supabase.from("blogs").insert([blogData]);

        if (error) throw error;
        toast.success("Blog created successfully");
      }
      navigate("/admin/blogs");
    } catch (error: any) {
      toast.error("Error saving blog: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/blogs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-playfair font-bold text-gray-900">
            {isEditing ? "Edit Blog" : "Create New Blog"}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter blog title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...register("category")}
                placeholder="e.g. Technology"
              />
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                {...register("author")}
                placeholder="Author name"
              />
              {errors.author && (
                <p className="text-red-500 text-sm">{errors.author.message}</p>
              )}
            </div>

            <div className="space-y-4 flex flex-col">
              <Label htmlFor="published_at">Publish Date</Label>
              <Controller
                name="published_at"
                control={control}
                render={({ field }) => {
                  // Parse the current value to a Date object for the Calendar
                  let dateValue: Date | undefined;
                  if (field.value) {
                    // Try parsing if it's already YYYY-MM-DD (from default/ISO)
                    if (field.value.includes("-")) {
                      const parts = field.value.split("-");
                      // Check if YYYY-MM-DD or DD-MM-YYYY
                      if (parts[0].length === 4) {
                        // YYYY-MM-DD
                        dateValue = new Date(field.value);
                      } else if (parts[2].length === 4) {
                        // DD-MM-YYYY
                        const [d, m, y] = parts;
                        dateValue = new Date(`${y}-${m}-${d}`);
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
                            // Store as DD-MM-YYYY
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
            <Label htmlFor="image_url">Cover Image</Label>
            <Controller
              name="image_url"
              control={control}
              render={({ field }) => (
                <ImageUpload value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.image_url && (
              <p className="text-red-500 text-sm">{errors.image_url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Short Description</Label>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              placeholder="Short description for the card..."
              className="h-24"
            />
            {errors.excerpt && (
              <p className="text-red-500 text-sm">{errors.excerpt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              onCheckedChange={(checked) =>
                setValue("is_featured", checked as boolean)
              }
            />
            <Label htmlFor="is_featured">Feature this post</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link to="/admin/blogs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Blog"
                : "Create Blog"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;
