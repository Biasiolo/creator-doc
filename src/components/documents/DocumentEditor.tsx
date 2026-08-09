import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  content: string;
  onChange: (html: string) => void;
  editable?: boolean;
}

export function DocumentEditor({ content, onChange, editable = true }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    editorProps: { attributes: { class: "doc-typography outline-none min-h-[240mm]" } },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  if (!editor) {
    return (
      <div className="a4-sheet doc-typography" dangerouslySetInnerHTML={{ __html: content }} />
    );
  }

  const actions = [
    { icon: Bold, label: "Negrito", run: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { icon: Italic, label: "Itálico", run: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { icon: UnderlineIcon, label: "Sublinhado", run: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline") },
    { icon: Heading1, label: "Título", run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
    { icon: Heading2, label: "Subtítulo", run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { icon: List, label: "Lista", run: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { icon: ListOrdered, label: "Lista numerada", run: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { icon: AlignLeft, label: "Alinhar à esquerda", run: () => editor.chain().focus().setTextAlign("left").run(), active: editor.isActive({ textAlign: "left" }) },
    { icon: AlignCenter, label: "Centralizar", run: () => editor.chain().focus().setTextAlign("center").run(), active: editor.isActive({ textAlign: "center" }) },
    { icon: AlignJustify, label: "Justificar", run: () => editor.chain().focus().setTextAlign("justify").run(), active: editor.isActive({ textAlign: "justify" }) },
    { icon: Undo2, label: "Desfazer", run: () => editor.chain().focus().undo().run(), active: false },
    { icon: Redo2, label: "Refazer", run: () => editor.chain().focus().redo().run(), active: false },
  ];

  return (
    <div className="space-y-4">
      {editable && (
        <div className="no-print sticky top-16 z-20 flex flex-wrap gap-1 rounded-xl border border-border bg-card/95 p-1.5 shadow-soft backdrop-blur">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              title={action.label}
              aria-label={action.label}
              onClick={action.run}
              className={cn(
                "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                action.active && "bg-accent text-accent-foreground",
              )}
            >
              <action.icon className="size-4" />
            </button>
          ))}
        </div>
      )}

      <div className="a4-sheet">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
