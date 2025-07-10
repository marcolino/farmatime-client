import React, { useState, useCallback, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { Box, Button } from '@mui/material';
import {
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon
} from '@mui/icons-material';

const editorConfig = {
  namespace: 'JobEmailEditor',
  theme: {
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
      underline: 'editor-text-underline',
    },
  },
  onError: (error) => console.error(error),
};

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setActiveFormats({
          bold: selection.hasFormat('bold'),
          italic: selection.hasFormat('italic'),
          underline: selection.hasFormat('underline'),
        });
      }
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const applyFormat = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <Box sx={{
      display: 'flex',
      gap: 1,
      p: 1,
      borderBottom: '1px solid #eee',
      bgcolor: '#f5f5f5'
    }}>
      <Button
        variant={activeFormats.bold ? 'contained' : 'outlined'}
        size="small"
        onClick={() => applyFormat('bold')}
        sx={{ minWidth: 'auto', px: 1 }}
      >
        <FormatBoldIcon fontSize="small" />
      </Button>
      <Button
        variant={activeFormats.italic ? 'contained' : 'outlined'}
        size="small"
        onClick={() => applyFormat('italic')}
        sx={{ minWidth: 'auto', px: 1 }}
      >
        <FormatItalicIcon fontSize="small" />
      </Button>
      <Button
        variant={activeFormats.underline ? 'contained' : 'outlined'}
        size="small"
        onClick={() => applyFormat('underline')}
        sx={{ minWidth: 'auto', px: 1 }}
      >
        <FormatUnderlinedIcon fontSize="small" />
      </Button>
    </Box>
  );
};

const RichTextEditor = ({ initialHtml, onChange }) => {
  const handleEditorChange = useCallback((editorState, editor) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor, null);
      onChange(html);
    });
  }, [onChange]);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <Box sx={{
            '& .editor-text-bold': { fontWeight: 'bold' },
            '& .editor-text-italic': { fontStyle: 'italic' },
            '& .editor-text-underline': { textDecoration: 'underline' },
            minHeight: '150px',
            border: '1px solid #eee',
            p: 2,
          }}>
            <ContentEditable
              className="editor-input"
              style={{
                minHeight: 'inherit',
                outline: 'none',
              }}
            />
          </Box>
        }
        placeholder={<div style={{ color: '#999', position: 'absolute' }}>Enter text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <OnChangePlugin onChange={handleEditorChange} />
    </LexicalComposer>
  );
};

const JobEmailTemplate = () => {
  const [editorHtml, setEditorHtml] = useState('');

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <RichTextEditor 
        initialHtml={editorHtml}
        onChange={setEditorHtml}
      />
    </div>
  );
};

export default JobEmailTemplate;
