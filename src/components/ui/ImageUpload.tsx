import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  bucket?: string;
  className?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  bucket = "blog-images",
  className = "",
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

      onChange(data.publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error("Error uploading image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-gray-200">
          <img
            src={value}
            alt="Upload"
            className="object-cover w-full h-full"
          />
          <Button
            onClick={handleRemove}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-8 h-8 rounded-full"
            type="button"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full max-w-sm aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-primary/50 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
            )}
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              SVG, PNG, JPG or GIF (MAX. 2MB)
            </p>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
    </div>
  );
};
