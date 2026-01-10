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
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageUpload } from "@/components/ui/ImageUpload";

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
    },
  });

  const type = watch("type");

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
            published_at: data.published_at,
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
      if (isEditing) {
        const { error } = await supabase
          .from("articles")
          .update(data)
          .eq("id", id);

        if (error) throw error;
        toast.success("Updated successfully");
      } else {
        const { error } = await supabase.from("articles").insert([
          {
            title: data.title,
            type: data.type,
            published_at: data.published_at,
            link: data.link,
            image_url: data.image_url,
          },
        ]);

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

            <div className="space-y-2">
              <Label htmlFor="published_at">Date Display</Label>
              <Input
                id="published_at"
                {...register("published_at")}
                placeholder="e.g. Oct 4, 2020 or Sep/Oct 2019"
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
