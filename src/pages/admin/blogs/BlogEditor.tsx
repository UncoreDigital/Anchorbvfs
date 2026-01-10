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
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageUpload } from "@/components/ui/ImageUpload";

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
            published_at: data.published_at.split("T")[0],
          });
        }
      };

      fetchBlog();
    }
  }, [id, isEditing, navigate, reset]);

  const onSubmit = async (data: BlogFormValues) => {
    setLoading(true);
    try {
      if (isEditing) {
        const { error } = await supabase
          .from("blogs")
          .update(data)
          .eq("id", id);

        if (error) throw error;
        toast.success("Blog updated successfully");
      } else {
        const { error } = await supabase.from("blogs").insert([data]);

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

            <div className="space-y-2">
              <Label htmlFor="published_at">Publish Date</Label>
              <Input
                type="date"
                id="published_at"
                {...register("published_at")}
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
            <Label htmlFor="excerpt">Excerpt</Label>
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
