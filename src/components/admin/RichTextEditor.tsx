import { useEffect, useRef, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link,
  AlignLeft, AlignCenter, AlignRight,
  Image, Minus, Undo, Redo,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
}

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
};

function ToolbarButton({ onClick, active, title, children, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn(
        'h-8 w-8 flex items-center justify-center rounded text-sm transition-colors',
        'hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring',
        active ? 'bg-muted text-foreground font-semibold' : 'text-muted-foreground',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return <div className="w-px h-6 bg-border mx-1" />;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing…',
  minHeight = 320,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const savedRange = useRef<Range | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = useCallback((command: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    if (editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const queryState = useCallback((command: string) => {
    try { return document.queryCommandState(command); } catch { return false; }
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRange.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange.current);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;
    restoreSelection();
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const selectedText = range.toString() || linkUrl;
      const anchor = document.createElement('a');
      anchor.href = linkUrl;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = selectedText;
      if (!sel.isCollapsed) range.deleteContents();
      range.insertNode(anchor);
      sel.collapse(anchor, anchor.childNodes.length);
    } else {
      exec('createLink', linkUrl);
    }
    setLinkUrl('');
    setLinkOpen(false);
    if (editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertImage = () => {
    if (!imageUrl.trim()) return;
    restoreSelection();
    editorRef.current?.focus();
    exec('insertHTML', `<img src="${imageUrl}" alt="image" style="max-width:100%;height:auto;border-radius:8px;margin:8px 0;" />`);
    setImageUrl('');
    setImageOpen(false);
  };

  const insertHorizontalRule = () => {
    exec('insertHTML', '<hr style="border:none;border-top:2px solid #e2e8f0;margin:16px 0;" />');
  };

  const setHeading = (level: 1 | 2 | 3) => {
    exec('formatBlock', `h${level}`);
  };

  const clearFormat = () => {
    exec('removeFormat');
    exec('formatBlock', 'p');
  };

  const [, forceUpdate] = useState(0);
  const refreshState = () => forceUpdate(n => n + 1);

  return (
    <div className={cn('border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-ring bg-background', className)}>
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/30">
        <ToolbarButton onClick={clearFormat} title="Clear formatting">
          <Type className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarSeparator />

        <ToolbarButton onClick={() => exec('bold')} active={queryState('bold')} title="Bold (Ctrl+B)">
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('italic')} active={queryState('italic')} title="Italic (Ctrl+I)">
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('underline')} active={queryState('underline')} title="Underline (Ctrl+U)">
          <Underline className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('strikeThrough')} active={queryState('strikeThrough')} title="Strikethrough">
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarSeparator />

        <ToolbarButton onClick={() => setHeading(1)} title="Heading 1">
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => setHeading(2)} title="Heading 2">
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => setHeading(3)} title="Heading 3">
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarSeparator />

        <ToolbarButton onClick={() => exec('insertUnorderedList')} active={queryState('insertUnorderedList')} title="Bullet list">
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('insertOrderedList')} active={queryState('insertOrderedList')} title="Numbered list">
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', 'blockquote')} title="Quote">
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', 'pre')} title="Code block">
          <Code className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarSeparator />

        <ToolbarButton onClick={() => exec('justifyLeft')} active={queryState('justifyLeft')} title="Align left">
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('justifyCenter')} active={queryState('justifyCenter')} title="Align center">
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('justifyRight')} active={queryState('justifyRight')} title="Align right">
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarSeparator />

        <Popover open={linkOpen} onOpenChange={(open) => { if (open) saveSelection(); setLinkOpen(open); }}>
          <PopoverTrigger asChild>
            <button
              type="button"
              title="Insert link"
              className="h-8 w-8 flex items-center justify-center rounded text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <Link className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="start">
            <p className="text-sm font-medium mb-2">Insert Link</p>
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && insertLink()}
              className="mb-2 text-sm"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setLinkOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={insertLink}>Insert</Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={imageOpen} onOpenChange={(open) => { if (open) saveSelection(); setImageOpen(open); }}>
          <PopoverTrigger asChild>
            <button
              type="button"
              title="Insert image"
              className="h-8 w-8 flex items-center justify-center rounded text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <Image className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="start">
            <p className="text-sm font-medium mb-2">Insert Image</p>
            <Input
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && insertImage()}
              className="mb-2 text-sm"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setImageOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={insertImage}>Insert</Button>
            </div>
          </PopoverContent>
        </Popover>

        <ToolbarButton onClick={insertHorizontalRule} title="Horizontal rule">
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarSeparator />

        <ToolbarButton onClick={() => exec('undo')} title="Undo (Ctrl+Z)">
          <Undo className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('redo')} title="Redo (Ctrl+Y)">
          <Redo className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={refreshState}
        onMouseUp={refreshState}
        onFocus={refreshState}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className={cn(
          'p-4 focus:outline-none text-sm leading-relaxed',
          'prose prose-sm max-w-none',
          '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2',
          '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2',
          '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1',
          '[&_p]:my-2',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2',
          '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2',
          '[&_li]:my-1',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-3',
          '[&_pre]:bg-muted [&_pre]:rounded [&_pre]:p-3 [&_pre]:text-xs [&_pre]:font-mono [&_pre]:my-3 [&_pre]:overflow-x-auto',
          '[&_code]:bg-muted [&_code]:rounded [&_code]:px-1 [&_code]:text-xs [&_code]:font-mono',
          '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
          '[&_img]:rounded-lg [&_img]:max-w-full',
          '[&_hr]:border-t-2 [&_hr]:border-border [&_hr]:my-4',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none'
        )}
      />
    </div>
  );
}

export function RichTextDisplay({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn(
        'prose prose-sm max-w-none text-sm leading-relaxed',
        '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3',
        '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2',
        '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2',
        '[&_p]:my-3 [&_p]:leading-relaxed',
        '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3',
        '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3',
        '[&_li]:my-1',
        '[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-4',
        '[&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-xs [&_pre]:font-mono [&_pre]:my-4 [&_pre]:overflow-x-auto',
        '[&_code]:bg-muted [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono',
        '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary/80',
        '[&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-4',
        '[&_hr]:border-t-2 [&_hr]:border-border [&_hr]:my-6',
        '[&_strong]:font-semibold [&_em]:italic',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
