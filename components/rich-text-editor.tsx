"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (nextValue: string) => void;
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
    }
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className="rich-editor-shell">
      <div className="rich-toolbar">
        <button className="button button-secondary" onClick={() => editor.chain().focus().toggleBold().run()} type="button">
          Bold
        </button>
        <button className="button button-secondary" onClick={() => editor.chain().focus().toggleItalic().run()} type="button">
          Italic
        </button>
        <button className="button button-secondary" onClick={() => editor.chain().focus().toggleBulletList().run()} type="button">
          Bullet List
        </button>
        <button className="button button-secondary" onClick={() => editor.chain().focus().toggleOrderedList().run()} type="button">
          Numbered List
        </button>
        <button className="button button-secondary" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} type="button">
          H2
        </button>
        <button className="button button-secondary" onClick={() => editor.chain().focus().setParagraph().run()} type="button">
          Paragraph
        </button>
      </div>

      <EditorContent className="rich-editor" editor={editor} />
    </div>
  );
}
