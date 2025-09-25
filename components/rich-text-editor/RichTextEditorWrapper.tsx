import dynamic from 'next/dynamic';

// Import the RichTextEditor dynamically with no SSR
const DynamicRichTextEditor = dynamic(
    () => import('./Editor').then((mod) => mod.RichTextEditor),
    {
        ssr: false,
        loading: () => (
            <div className="border rounded-lg animate-pulse">
                <div className="border-b p-2 h-10 bg-gray-100"></div>
                <div className="p-4 h-32 bg-gray-50"></div>
            </div>
        ),
    }
);

// Export this component to use in your forms
export default function RichTextEditorWrapper(props: any) {
    return <DynamicRichTextEditor {...props} />;
}