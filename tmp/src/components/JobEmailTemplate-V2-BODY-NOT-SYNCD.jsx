import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import EditIcon from '@mui/icons-material/Edit';
import DraftsIcon from '@mui/icons-material/Drafts';
import CloseIcon from '@mui/icons-material/Close';
import PreviewIcon from '@mui/icons-material/Preview';

import { Editor } from 'react-draft-wysiwyg';
import {
  EditorState,
  convertToRaw,
  ContentState,
  Modifier,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { ContextualHelp } from './ContextualHelp';
import { StyledPaper, StyledBox } from './JobStyles';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
//import { SdCardAlert } from '@mui/icons-material';

const JobEmailTemplate = ({ data, onChange }) => {
  const { t } = useTranslation();

  // Variables and their preview values
  const variables = [
    '{NOME DEL DOTTORE}',
    '{NOME E COGNOME DEL PAZIENTE}',
    '{FIRMA DEL MITTENTE}',
    '{NOME DEL FARMACO}',
  ];
  const variablesValuesForPreview = [ // TODO...
    'Dott.ssa Siringhetti',
    'Culetto Rosa',
    'Mario Rossi (tel.: 333 4567890)',
    ' Tachipirina 1000',
  ];

  // Initial data snapshot for cancel/reset
  const dataInitial = useMemo(() => {
    return {
      subject: data.subject || '',
      body: data.body || '',
      signature: data.signature || '',
    };
  }, [data.subject, data.body, data.signature]);

  // States for controlled fields
  const [subject, setSubject] = useState(data.subject || '');
  
  const [signature, setSignature] = useState(data.signature || '');

  // EditorState for body
  const [editorState, setEditorState] = useState(() => {
    if (data.body) {
      const contentBlock = htmlToDraft(data.body);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
          contentBlock.entityMap
        );
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  // Editing mode
  const [editing, setEditing] = useState(false);

  // Preview dialog state
  const [previewIsOpen, setPreviewIsOpen] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [expandedHtml, setExpandedHtml] = useState('');

  // Sync local states when data prop changes (only if not editing)
  useEffect(() => {
    if (!editing) {
      setSubject(data.subject || '');
      setSignature(data.signature || '');
      if (data.body) {
        const contentBlock = htmlToDraft(data.body);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks,
            contentBlock.entityMap
          );
          setEditorState(EditorState.createWithContent(contentState));
        }
      } else {
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [data, editing]);

  // Handle variable insertion in editor
  const handleInsertVariable = (variable) => {
    if (!editing) return;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    const newContentState = Modifier.insertText(
      contentState,
      selectionState,
      variable
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'insert-characters'
    );

    setEditorState(newEditorState);
  };

  // Handle cancel: reset states to initial data
  const handleCancel = () => {
    setSubject(dataInitial.subject);
    setSignature(dataInitial.signature);

    if (dataInitial.body) {
      const contentBlock = htmlToDraft(dataInitial.body);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
          contentBlock.entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
      }
    } else {
      setEditorState(EditorState.createEmpty());
    }
    setEditing(false);
  };

  const handleGenerateHtml = () => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setGeneratedHtml(html);
    console.log('Subject:', subject);
    console.log('Generated HTML:', html);
  };

  // Handle confirm: call onChange with updated data
  const handleConfirm = () => {
    handleGenerateHtml(); // TODO: ok?
    const htmlBody = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    onChange({
      subject,
      body: htmlBody,
      signature,
    });
    setEditing(false);
  };

  // Handle preview: replace variables in HTML and open dialog
  const handlePreviewEmail = () => {
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    variables.forEach((variable, index) => {
      const escapedVar = variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const replacement = variablesValuesForPreview[index];
      html = html.replace(new RegExp(escapedVar, 'g'), replacement);
    });
    setExpandedHtml(html);
    setPreviewIsOpen(true);
  };

  // Fields configuration for subject and signature (plain TextField)
  const fields = [
    {
      label: t('Email subject'),
      key: 'subject',
      value: subject,
      onChange: (val) => setSubject(val),
      multiline: false,
      disabled: !editing,
      helpKey: 'EmailTemplateSubject',
    },
    {
      label: t("Email body"),
      key: 'body',
      //value: body,
      onChange: (val) => alert('body onChange: ' + val),
      multiline: true,
      disabled: !editing,
      helpKey: 'EmailTemplateBody',
      //placeholder: '',
    },
    {
      label: t('Email signature'),
      key: 'signature',
      value: signature,
      onChange: (val) => setSignature(val),
      multiline: false,
      disabled: !editing,
      helpKey: 'EmailTemplateSignature',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <StyledPaper>
        <StyledBox>
          <Typography variant="h5" fontWeight="bold">
            {t('Email Template')}
          </Typography>
        </StyledBox>

        <Box p={4} pb={2}>
          {/* Subject and Signature Fields */}
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              flexWrap: 'wrap',
              mb: 2,
            }}
          >
            {fields.map(({ label, key, value, onChange, multiline, disabled, helpKey }) => (
              <Box
                key={key}
                sx={{ flex: { xs: '1 1 100%' }, mb: 2 }}
              >
                <ContextualHelp helpPagesKey={helpKey} fullWidth showOnHover>
                  {(key === 'body') && !editing && (
                    <TextField
                      disabled={disabled}
                      fullWidth
                      multiline={multiline}
                      rows={multiline ? 4 : 1}
                      label={label}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  )}
                  {(key === 'body') && editing && ( // Body Field with Rich Text Editor
                    <Box component="fieldset" label={t('Email body')}
                      sx={{
                        border: '1px solid',
                        borderColor: 'grey.400',
                        borderRadius: 1.2,
                        mb: 2,
                        p: 1
                      }}>
                      <Typography component="legend" variant="caption" sx={{ p: 0.66 }}>
                        {t('Email body')}
                      </Typography>

                      {/* Variable insertion buttons */}
                      <Box sx={{ mb: 1 }}>
                        {variables.map((varName) => (
                          <Chip
                            key={varName}
                            //variant="outlined"
                            //size="small"
                            onClick={() => handleInsertVariable(varName)}
                            sx={{
                              bgcolor: '#eeee44',
                              mx: 0.5,
                              mb: 1,
                              border: 1
                            }}
                            label={varName}
                          >
                          </Chip>
                        ))}
                      </Box>

                      <ContextualHelp helpPagesKey={'helpKey'} fullWidth showOnHover>
                        <Editor
                          editorState={editorState}
                          onEditorStateChange={setEditorState}
                          toolbar={{
                            options: ['inline'],
                            inline: { options: ['bold', 'italic', 'underline'] },
                          }}
                          editorStyle={{
                            minHeight: '200px',
                            padding: '8px',
                            backgroundColor: editing ? '#cf4f8' : '#f5f5f5',
                            pointerEvents: editing ? 'auto' : 'none',
                          }}
                        />
                      </ContextualHelp>
                    </Box>
                  )}
                  {(key !== 'body') && (
                    <TextField
                      disabled={disabled}
                      fullWidth
                      multiline={multiline}
                      rows={multiline ? 4 : 1}
                      label={label}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  )}
                </ContextualHelp>
              </Box>
            ))}
          </Box>

          {/* TODO: only for development */}
          {generatedHtml && (
            <Box sx={{ mt: 3, p: 2, border: '1px dashed #ccc' }}>
              <Typography variant="subtitle1">{t('Email subject')}:</Typography>
              <p>{subject}</p>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>HTML Output:</Typography>
              <pre>{generatedHtml}</pre>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {editing && (
              <Button variant="outlined" size="small" onClick={handleCancel}>
                {t('Cancel')}
              </Button>
            )}

            <Button
              variant="contained"
              size="medium"
              onClick={editing ? handleConfirm : () => setEditing(true)}
              endIcon={<EditIcon />}
            >
              {editing ? t('Confirm changes') : t('Edit email template')}
            </Button>

            {/* Preview button always available */}
            {editing && (
              <Button
                variant="contained"
                size="medium"
                onClick={handlePreviewEmail}
                endIcon={<PreviewIcon />}
              >
                {t('Preview email')}
              </Button>
            )}
          </Box>
        </Box>
      </StyledPaper>

      {/* Preview Dialog */}
      <HtmlPreviewDialog
        isOpen={previewIsOpen}
        onClose={() => setPreviewIsOpen(false)}
        htmlContent={expandedHtml}
      />
    </Container>
  );
};

const HtmlPreviewDialog = ({ isOpen, onClose, htmlContent }) => {
  const { t } = useTranslation();

  console.log("htmlContent:", htmlContent, typeof htmlContent);
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
          {/* {JSON.stringify(htmlContent)} */}
          <Box
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            sx={{
              minHeight: '200px',
              overflowY: 'auto',
              p: 2,
              border: '1px solid #ccc',
            }}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default JobEmailTemplate;
