"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Menubar } from './Menubar';
import TextAlign from '@tiptap/extension-text-align';
export function RichTextEditor({field}:{field:any}){
    const editor = useEditor(
        {
            extensions: [StarterKit, 
                TextAlign.configure({types: ['heading', 'paragraph']})
            
            ],

            editorProps: {
                attributes: {
                    class: 'min-h-[300px] p-4 focus:outline-none prose sm:prose lg:prose xl:prose-xl dark:prose-invert !w-full !max-w-none ',
                },
            },

            immediatelyRender: false,

          onUpdate: ({editor}) =>{
            field.onChange(JSON.stringify(editor.getJSON()));
          },
          content: field.value ? JSON.parse(field.value): '<p>Hello World</p>'
            
        });
    if (!editor) {
        return <div>Loading editor...</div>;
    }
    return(
        <div className="w-full border border-input rounded-lg dark:bg-input/30 relative">
            <div className="sticky top-0 z-20 bg-background/95 dark:bg-input/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <Menubar editor={editor}/>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}