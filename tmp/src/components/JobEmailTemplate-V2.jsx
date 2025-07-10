import React, { useState, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Button, Typography, TextField, Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from 'mui-material-custom';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import DraftsIcon from '@mui/icons-material/Drafts';
import CloseIcon from '@mui/icons-material/Close';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';

//import { $getRoot } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useSnackbarContext } from '../providers/SnackbarProvider';
import { JobContext } from '../providers/JobContext';
import { AuthContext } from '../providers/AuthContext';
import { variablesExpand, variableTokens } from './JobEmailTemplateVariables';

const JobEmailTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { job, setJob, jobError } = useContext(JobContext);
  const { auth } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext();

  const [subject, setSubject] = useState(job?.emailTemplate?.subject || '');
  const [editorHtml, setEditorHtml] = useState(job?.emailTemplate?.body || '');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const initialConfig = {
    namespace: 'JobEmailEditor',
    onError: console.error,
    // Set initial editor state from HTML
    editorState: job?.emailTemplate?.body ? () => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(job.emailTemplate.body, 'text/html');
      return $generateNodesFromDOM(editor, dom);
    } : undefined,
  };

  const handleEditorChange = useCallback((editorState, editor) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor, null);
      setEditorHtml(html);
    });
  }, []);

  const insertToken = (token) => {
    // Simplest: append token. For full insertion, you'd use editor commands.
    setEditorHtml((prev) => prev + token);
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
    return (
      <Container><Typography color="error">{t('Error loading job')}</Typography></Container>
    );
  }
  if (!job) {
    return (
      <Container><Typography>{t('Loading...')}</Typography></Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight="bold">{t('Email Template')}</Typography>

      <Box mb={2}>
        <TextField
          fullWidth 
          label={t('Email subject')}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Box>

      <Box mb={2}>
        {Object.keys(variableTokens).map((token) => (
          <Chip
            key={token}
            label={t(token)}
            onClick={() => insertToken(token)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>

      {/* Add label for email body */}
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
        {t('Email body')}
      </Typography>
      
      <Box mb={2} sx={{ border: '1px solid #ccc', borderRadius: 1 }}>
        <LexicalComposer initialConfig={initialConfig}>
          {/* Add the toolbar */}
          <ToolbarPlugin />
          
          <Box sx={{ p: 2, minHeight: 200 }}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable 
                  aria-placeholder={t('Enter email body...')}
                  style={{
                    outline: 'none',
                    minHeight: '150px',
                    padding: '8px',
                  }}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </Box>
          
          <HistoryPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
        </LexicalComposer>
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={() => navigate(-1)}>{t('Cancel')}</Button>
        <Button variant="contained" startIcon={<PreviewIcon />} onClick={handlePreview}>
          {t('Preview')}
        </Button>
        <Button variant="contained" endIcon={<EditIcon />} onClick={handleConfirm}>
          {t('Save')}
        </Button>
      </Box>

      <HtmlPreviewDialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        subject={subject}
        htmlContent={variablesExpand(editorHtml, job, auth)}
      />
    </Container>
  );
};

//import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
// import { $isHeadingNode } from '@lexical/rich-text';
// import { $getNearestNodeOfType } from '@lexical/utils';
//import { Button, Box } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, []);

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (format) => {
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
        variant={isBold ? 'contained' : 'outlined'}
        size="small"
        onClick={() => formatText('bold')}
        sx={{ minWidth: 'auto', px: 1 }}
      >
        <FormatBoldIcon />
      </Button>
      <Button
        variant={isItalic ? 'contained' : 'outlined'}
        size="small"
        onClick={() => formatText('italic')}
        sx={{ minWidth: 'auto', px: 1 }}
      >
        <FormatItalicIcon />
      </Button>
      <Button
        variant={isUnderline ? 'contained' : 'outlined'}
        size="small"
        onClick={() => formatText('underline')}
        sx={{ minWidth: 'auto', px: 1 }}
      >
        <FormatUnderlinedIcon />
      </Button>
    </Box>
  );
}

const HtmlPreviewDialog = ({ isOpen, onClose, subject, htmlContent }) => {
  const { t } = useTranslation();
  //const { auth } = useContext(AuthContext);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          mb: 2,
        }}
      >
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
          <Box
            sx={{
              overflowY: 'auto',
              p: 2,
              border: '1px solid #ccc',
              mb: 2,
            }}
          >
            <Typography variant="h6">
              {subject}
            </Typography>
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

export default JobEmailTemplate;
