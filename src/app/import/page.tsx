"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<JSONValue>(null);
  const [loading, setLoading] = useState(false);

  // Handle File Selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const parsedJson = JSON.parse(e.target?.result as string);
          setJsonData(parsedJson);
        } catch (error) {
          toast.error("Invalid JSON file");
          setFile(null);
        }
      };

      reader.readAsText(selectedFile);
    } else {
      toast.error("Please select a valid JSON file.");
      setFile(null);
    }
  };

  // Handle Upload
  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload");

      toast.success("File uploaded successfully!");
      setFile(null);
      setJsonData(null);
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Import JSON Data</CardTitle>
          <CardDescription>Select a JSON file to upload</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept=".json" onChange={handleFileChange} />

          {jsonData && (
            <div className="p-3 border rounded-md bg-gray-100 dark:bg-gray-800 text-sm max-h-40 overflow-auto">
              <pre>
                <code>{JSON.stringify(jsonData, null, 2)}</code>
              </pre>
            </div>
          )}

          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
