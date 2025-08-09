import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Heading1,
    Heading2,
    Heading3,
} from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({
    content,
    onChange,
    placeholder = 'Start typing...',
    className,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Typography,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none',
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className={cn('border rounded-lg', className)}>
            {/* Toolbar */}
            <div className="border-b p-2 flex flex-wrap gap-1">
                <Button
                    type="button"
                    variant={editor.isActive('bold') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant={editor.isActive('italic') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <div className="w-px bg-gray-300 mx-1" />

                <Button
                    type="button"
                    variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <div className="w-px bg-gray-300 mx-1" />

                <Button
                    type="button"
                    variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant={editor.isActive('blockquote') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <div className="w-px bg-gray-300 mx-1" />

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                >
                    <Undo className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    );
}