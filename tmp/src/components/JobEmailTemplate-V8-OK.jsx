import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Button,
  Typography,
  TextField,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from 'mui-material-custom';
import {
  Edit as EditIcon,
  Preview as PreviewIcon,
  Drafts as DraftsIcon,
  Close as CloseIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
} from '@mui/icons-material';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, $getRoot, $insertNodes, $createParagraphNode, $createTextNode } from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';

import { ContextualHelp } from './ContextualHelp';
import { StyledPaper, StyledBox } from './JobStyles';
import { useSnackbarContext } from '../providers/SnackbarProvider';
import { JobContext } from '../providers/JobContext';
import { AuthContext } from '../providers/AuthContext';
import { variablesExpand, variableTokens } from './JobEmailTemplateVariables';

// Lexical Editor Configuration
const editorConfig = {
  namespace: 'JobEmailEditor',
  theme: {
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
      underline: 'editor-text-underline',
    },
  },
  onError: (error) => {
    console.error(error);
  },
};

// Text Insertion Component
const TextInsertionPlugin = ({ textToInsert }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!textToInsert) return;

    editor.update(() => {
      const selection = $getSelection();
      
      if ($isRangeSelection(selection)) {
        // Insert at current caret position
        const textNode = $createTextNode(textToInsert);
        selection.insertNodes([textNode]);
        
        // Move cursor to end of inserted text
        selection.insertText('');
      } else {
        // Fallback: append at end if no selection
        const root = $getRoot();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(textToInsert));
        root.append(paragraph);
      }
    });
  }, [textToInsert, editor]);

  return null;
};

// Toolbar Component
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
      borderBottom: '1px solid #ccc',
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

// Initial HTML Plugin
const InitialHtmlPlugin = ({ initialHtml }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initialHtml) return;

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      try {
        const parser = new DOMParser();
        const dom = parser.parseFromString(
          `<div>${initialHtml}</div>`,
          'text/html'
        );
        const nodes = $generateNodesFromDOM(editor, dom);
        
        if (nodes.length > 0) {
          $insertNodes(nodes);
        } else {
          const paragraph = $createParagraphNode();
          paragraph.append(initialHtml);
          root.append(paragraph);
        }
      } catch (error) {
        console.error('Error parsing HTML:', error);
        const paragraph = $createParagraphNode();
        paragraph.append(initialHtml);
        root.append(paragraph);
      }
    });
  }, [editor, initialHtml]);

  return null;
};

// Preview Dialog Component
const HtmlPreviewDialog = ({ open, onClose, subject, htmlContent }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{
        bgcolor: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        mb: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DraftsIcon sx={{ fontSize: 24, color: 'white', mx: 1 }} />
          <span style={{ color: 'white' }}>{t('Email preview')}</span>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
          }}
        >
          <CloseIcon sx={{ color: 'white' }} />
        </IconButton>
      </DialogTitle>

      {htmlContent && (
        <DialogContent>
          <Box sx={{ overflowY: 'auto', p: 2, border: '1px solid #ccc', mb: 2 }}>
            <Typography variant="h6">{subject}</Typography>
          </Box>
          <Box
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            sx={{
              minHeight: '200px',
              overflowY: 'auto',
              p: 2,
              pt: 0,
              border: '1px solid #ccc',
            }}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};

// Main Component
const JobEmailTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { job, setJob, jobError } = useContext(JobContext);
  const { auth } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext();

  const [subject, setSubject] = useState(job?.emailTemplate?.subject || '');
  const [editorHtml, setEditorHtml] = useState(job?.emailTemplate?.body || '');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [textToInsert, setTextToInsert] = useState(null);

  const handleEditorChange = useCallback((editorState, editor) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor, null);
      setEditorHtml(html);
    });
  }, []);

  const insertToken = (token) => {
    setTextToInsert(token.name);
  };

  const handleConfirm = () => {
    setJob((j) => ({
      ...j,
      emailTemplate: { subject, body: editorHtml },
    }));
    showSnackbar(t('Email template updated successfully'), 'success');
    setTimeout(() => navigate(-1), 1500);
  };

  const handlePreview = () => setIsPreviewOpen(true);

  if (jobError) {
    return <Container><Typography color="error">{t('Error loading job')}</Typography></Container>;
  }
  if (!job) {
    return <Container><Typography>{t('Loading...')}</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <StyledPaper>
        <StyledBox>
          <Typography variant="h5" fontWeight="bold">
            {t('Email Template')}
          </Typography>
        </StyledBox>

        <Box m={4}>
          <Box>
            <ContextualHelp helpPagesKey={'EmailTemplateSubject'} fullWidth showOnHover>
              <TextField
                fullWidth
                label={t('Email subject')}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </ContextualHelp>
          </Box>
    
          <ContextualHelp helpPagesKey={'EmailTemplateVariables'} fullWidth showOnHover>
            <Box mt={4} label={t('Variables')}>
              {Object.keys(variableTokens).map((token) => (
                <Chip
                  key={token}
                  label={t(token)}
                  onClick={() => insertToken(variableTokens[token])}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </ContextualHelp>

          <ContextualHelp helpPagesKey={'EmailTemplateVariables'} fullWidth showOnHover>
            <Box mt={2} label={t('Email body')}>
              <LexicalComposer initialConfig={editorConfig}>
                <ToolbarPlugin />
                <InitialHtmlPlugin initialHtml={job?.emailTemplate?.body} />
                <TextInsertionPlugin textToInsert={textToInsert} />
                
                <Box sx={{ 
                  p: 2, 
                  minHeight: 200, 
                  border: '1px solid #eee',
                  '& .editor-text-bold': { fontWeight: 'bold' },
                  '& .editor-text-italic': { fontStyle: 'italic' },
                  '& .editor-text-underline': { textDecoration: 'underline' },
                }}>
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable
                        className="editor-input"
                        aria-placeholder={t('Enter email body...')}
                        style={{
                          outline: 'none',
                          minHeight: '150px',
                          padding: '8px',
                        }}
                      />
                    }
                    placeholder={<div style={{ color: '#999', position: 'absolute' }}>{t('Enter email body...')}</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                </Box>
                
                <HistoryPlugin />
                <OnChangePlugin onChange={handleEditorChange} />
              </LexicalComposer>
            </Box>
          </ContextualHelp>

          <Box m={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" onClick={() => navigate(-1)}>
              {t('Cancel')}
            </Button>
            <Button variant="contained" startIcon={<PreviewIcon />} onClick={handlePreview}>
              {t('Preview')}
            </Button>
            <Button variant="contained" color="primary" endIcon={<EditIcon />} onClick={handleConfirm}>
              {t('Save')}
            </Button>
          </Box>

          <HtmlPreviewDialog
            open={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            subject={subject}
            htmlContent={variablesExpand(editorHtml, job, auth)}
          />
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default JobEmailTemplate;
