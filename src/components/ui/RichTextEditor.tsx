import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  ImagePlus,
  Undo,
  Redo,
  Palette,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Crop,
  Link as LinkIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const COLORS = [
  "#000000",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

const HIGHLIGHT_COLORS = [
  "#FEF08A",
  "#FDE68A",
  "#D9F99D",
  "#A7F3D0",
  "#99F6E4",
  "#A5F3FC",
  "#BFDBFE",
  "#DDD6FE",
  "#FBCFE8",
  "#FECACA",
  "#FED7AA",
  "#FFFFFF",
];

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [colorOpen, setColorOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-sm",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your story...",
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none min-h-[400px] px-1",
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          const files = Array.from(event.dataTransfer.files);
          const images = files.filter((file) => file.type.startsWith("image/"));
          if (images.length > 0) {
            event.preventDefault();
            images.forEach((image) => uploadImage(image));
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of Array.from(items)) {
            if (item.type.startsWith("image/")) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file) uploadImage(file);
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  const uploadImage = useCallback(
    async (file: File) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      toast({
        title: "Uploading image...",
        description: "Please wait while we upload your image.",
      });

      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (error) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(data.path);

      if (editor && urlData.publicUrl) {
        editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
        toast({
          title: "Image uploaded",
          description: "Your image has been added to the post.",
        });
      }
    },
    [editor, toast]
  );

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleCropImageButtonClick = () => {
    cropFileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
    event.target.value = "";
  };

  const handleCropFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    const file = new File([croppedBlob], `cropped-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    await uploadImage(file);
    setImageToCrop(null);
  };

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const setColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
    setColorOpen(false);
  };

  const setHighlight = (color: string) => {
    if (color === "#FFFFFF") {
      editor?.chain().focus().unsetHighlight().run();
    } else {
      editor?.chain().focus().setHighlight({ color }).run();
    }
    setHighlightOpen(false);
  };

  if (!editor) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card relative">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 border-b border-border bg-card/95 backdrop-blur-sm shadow-sm">
        {/* Text Color Picker */}
        <Popover open={colorOpen} onOpenChange={setColorOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="gap-1">
              <Palette className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="grid grid-cols-4 gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => setColor(color)}
                  title={color}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Highlight Color Picker */}
        <Popover open={highlightOpen} onOpenChange={setHighlightOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="gap-1">
              <Highlighter className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Highlight</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="grid grid-cols-4 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => setHighlight(color)}
                  title={color === "#FFFFFF" ? "Remove highlight" : color}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-muted" : ""}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "bg-muted" : ""
          }
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={editor.isActive("link") ? "bg-muted" : ""}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleImageButtonClick}
          title="Insert image"
        >
          <ImagePlus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCropImageButtonClick}
          title="Crop & insert image"
        >
          <Crop className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={cropFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleCropFileChange}
          className="hidden"
        />
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
