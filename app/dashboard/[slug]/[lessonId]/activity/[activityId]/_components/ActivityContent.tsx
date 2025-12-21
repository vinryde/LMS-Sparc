"use client";
import { ActivityContentType } from "@/app/data/course/get-activity-content";
import { RenderDescriptionn } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { FileText, Link as LinkIcon, ExternalLink, Image as ImageIcon, FileDown, ArrowLeft } from "lucide-react";
import Image from "next/image";

export function ActivityContent({ data, slug, lessonId }: { data: ActivityContentType; slug: string; lessonId: string }) {
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <div className="py-4">
        <Button asChild variant="outline">
          <Link href={`/dashboard/${slug}/${lessonId}`}>
            <ArrowLeft className="size-4 mr-2" />
            Back to Capsule
          </Link>
        </Button>
      </div>

      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{data.title}</h1>
        {data.description && <RenderDescriptionn json={JSON.parse(data.description)} />}

        {data.resources && data.resources.length > 0 && (
          <div className="mt-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Resources</CardTitle>
                <p className="text-sm text-muted-foreground">Additional materials to help you complete this activity</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.resources.map((resource) => (
                  <ResourceItem key={resource.id} resource={resource} />
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceItem({ resource }: { resource: any }) {
  const imageUrl = useConstructUrl(resource.imageKey || "");
  const documentUrl = useConstructUrl(resource.documentKey || "");

  if (resource.type === "TEXT") {
    return (
      <div className="p-4 border rounded-lg space-y-2 hover:bg-accent/50 transition-colors">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10 shrink-0">
            <FileText className="size-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base">{resource.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{resource.textContent}</p>
          </div>
        </div>
      </div>
    );
  }

  if (resource.type === "LINK") {
    return (
      <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10 shrink-0">
            <LinkIcon className="size-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-2">{resource.title}</h3>
            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
              <a href={resource.linkUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <ExternalLink className="size-4" />
                Open Link
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (resource.type === "IMAGE") {
    return (
      <div className="p-4 border rounded-lg space-y-3 hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10 shrink-0">
            <ImageIcon className="size-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-base flex-1">{resource.title}</h3>
        </div>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
          <Image src={imageUrl} alt={resource.title} fill className="object-contain" onClick={() => window.open(imageUrl, "_blank")} />
        </div>
      </div>
    );
  }

  if (resource.type === "DOCUMENT") {
    return (
      <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-orange-500/10 shrink-0">
            <FileDown className="size-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-2">{resource.title}</h3>
            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
              <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <FileDown className="size-4" />
                View Document
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}