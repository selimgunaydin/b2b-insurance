import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X, Upload } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  value?: string[];
  onChange: (value: string[]) => void;
  maxFiles?: number;
}

export function FileUpload({ value = [], onChange, maxFiles = 5 }: FileUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (value.length >= maxFiles) {
        toast({ title: "Hata", description: `En fazla ${maxFiles} dosya yükleyebilirsiniz.`, variant: "destructive" });
        return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange([...value, res.data.url]);
      toast({ title: "Başarılı", description: "Dosya yüklendi." });
    } catch (err) {
      console.error(err);
      toast({ title: "Hata", description: "Dosya yüklenirken hata oluştu.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*,.pdf"
          disabled={isUploading || value.length >= maxFiles}
          onChange={handleUpload}
          className="cursor-pointer"
        />
        {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
      
      {value.length > 0 && (
        <div className="grid gap-2">
            {value.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded bg-slate-50">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate max-w-[200px]">
                        Dosya {index + 1}
                    </a>
                    <Button variant="ghost" size="sm" onClick={() => handleRemove(index)} type="button">
                        <X className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
