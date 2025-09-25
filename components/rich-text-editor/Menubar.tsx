import { type Editor } from "@tiptap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import { Bold, Heading1Icon, Heading2Icon, Heading3Icon, Italic, ListIcon, ListOrdered, Strikethrough } from "lucide-react";
import { cn } from "@/lib/utils";



interface editorProps{
    editor: Editor | null;
}

export function Menubar({editor}: editorProps){
    if(!editor){
        return null;
    }
    return(
        <div className="border border-input rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
            <TooltipProvider>
               <div className="flex flex-wrap gap-1">
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Toggle size="sm" pressed={editor.isActive("bold")} 
                     onPressedChange={()=> editor.chain().focus().toggleBold().run()

                     } className={cn(
                        editor.isActive("bold") && "bg-muted text-muted-foreground"
                     )}>
                        <Bold/>
                     </Toggle>
                    </TooltipTrigger> 
                    <TooltipContent className="bg-primary" >Bold</TooltipContent>
                 </Tooltip>
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Toggle size="sm" pressed={editor.isActive("italic")} 
                     onPressedChange={()=> editor.chain().focus().toggleItalic().run()

                     } className={cn(
                        editor.isActive("italic") && "bg-muted text-muted-foreground"
                     )}>
                        <Italic/>
                     </Toggle>
                    </TooltipTrigger> 
                    <TooltipContent className="bg-primary" >Italic</TooltipContent>
                 </Tooltip>
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Toggle size="sm" pressed={editor.isActive("strike")} 
                     onPressedChange={()=> editor.chain().focus().toggleStrike().run()

                     } className={cn(
                        editor.isActive("strike") && "bg-muted text-muted-foreground"
                     )}>
                        <Strikethrough/>
                     </Toggle>
                    </TooltipTrigger> 
                    <TooltipContent className="bg-primary" >Strikethrough</TooltipContent>
                 </Tooltip>

                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Toggle size="sm" pressed={editor.isActive("heading", {level: 1})} 
                     onPressedChange={()=> editor.chain().focus().toggleHeading({level: 1}).run()

                     } className={cn(
                        editor.isActive("heading", {level: 1}) && "bg-muted text-muted-foreground"
                     )}>
                        <Heading1Icon/>
                     </Toggle>
                    </TooltipTrigger> 
                    <TooltipContent className="bg-primary" >Heading 1</TooltipContent>
                 </Tooltip>
                  <Tooltip>
                   <TooltipTrigger asChild>
                     <Toggle size="sm" pressed={editor.isActive("heading", {level: 2})} 
                     onPressedChange={()=> editor.chain().focus().toggleHeading({level: 2}).run()

                     } className={cn(
                        editor.isActive("heading", {level: 2}) && "bg-muted text-muted-foreground"
                     )}>
                        <Heading2Icon />
                     </Toggle>
                    </TooltipTrigger> 
                    <TooltipContent className="bg-primary" >Heading 2</TooltipContent>
                 </Tooltip>
                  <Tooltip>
                   <TooltipTrigger asChild>
                     <Toggle size="sm" pressed={editor.isActive("heading", {level: 3})} 
                     onPressedChange={()=> editor.chain().focus().toggleHeading({level: 3}).run()

                     } className={cn(
                        editor.isActive("heading", {level: 3}) && "bg-muted text-muted-foreground"
                     )}>
                        <Heading3Icon />
                     </Toggle>
                    </TooltipTrigger> 
                    <TooltipContent className="bg-primary" >Heading 3</TooltipContent>
                 </Tooltip>

                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Toggle size="sm" pressed={editor.isActive("bulletList")} 
                     onPressedChange={()=> editor.chain().focus().toggleBulletList().run()

                     } className={cn(
                        editor.isActive("bulletList") && "bg-muted text-muted-foreground"
                     )}>
                        <ListIcon/>
                     </Toggle>
                    </TooltipTrigger> 
                    <TooltipContent className="bg-primary" >Bullet List</TooltipContent>
                 </Tooltip>

                  <Tooltip>
                   <TooltipTrigger asChild>
                     <Toggle size="sm" pressed={editor.isActive("orderedList")} 
                     onPressedChange={()=> editor.chain().focus().toggleOrderedList().run()

                     } className={cn(
                        editor.isActive("orderedList") && "bg-muted text-muted-foreground"
                     )}>
                        <ListOrdered/>
                     </Toggle>
                    </TooltipTrigger> 
                    <TooltipContent className="bg-primary" >Ordered List</TooltipContent>
                 </Tooltip>
                 
                </div> 

                <div className="w-px h-6 bg-border mx-2"></div>
                <div className="flex flex-wrap gap-1">
                
                </div>
            </TooltipProvider>
        </div>
    )

}