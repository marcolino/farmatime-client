import { useState, /*useMemo, */useEffect } from 'react';
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
  TextFieldHtml,
} from 'mui-material-custom';
import { Global } from '@emotion/react';
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
//import config from '../config';


const JobEmailTemplate = ({ data, job, onChange, onCompleted }) => {
  const { t } = useTranslation();
  
  // States for controlled fields
  const [subject, setSubject] = useState(data.subject || '');
  const [body, setBody] = useState(data.body || '');
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
  //const [generatedHtml, setGeneratedHtml] = useState('');
  const [expandedHtml, setExpandedHtml] = useState('');

  // // effect to ensure defaults are passed to the parent when all values are missing
  // useEffect(() => {
  //   if (!data.subject && !data.body && !data.signature) {
  //     onChange({
  //       subject: dataDefaultValues.subject,
  //       body: dataDefaultValues.bodyHtml,
  //       signature: dataDefaultValues.signature,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  
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

  // When switching to editing mode, initialize editorState from bodyHtml
  useEffect(() => {
    if (editing) {
      const contentBlock = htmlToDraft(body);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
          contentBlock.entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [editing, body]);

  // inform caller a valid email template is available
  // useEffect(() => {
  //   if (isValid()) {
  //     onCompleted(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data]);

  // inform caller a valid email template is available
  useEffect(() => {
    onCompleted(isValid());
    // if (isValid()) {
    //   onCompleted(true);
    // } else {
    //   onCompleted(false);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.subject, data.body, data.signature]);

  const isValid = () => {
    return (data.subject && data.body && data.signature); // all 3 items must be present) 
  };

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

  const onEditorStateChange = (newState) => {
    setEditorState(newState);
    const html = draftToHtml(convertToRaw(newState.getCurrentContent()));
    setBody(html);
  };

  // const handleGenerateHtml = () => {
  //   const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  //   setGeneratedHtml(html);
  //   console.log('Subject:', subject);
  //   console.log('Generated HTML:', html);
  // };

  // Handle confirm: call onChange with updated data
  const handleConfirm = () => {
    //handleGenerateHtml(); // TODO: ok?
    //const htmlBody = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    onChange({
      subject,
      //body: htmlBody,
      body,
      signature,
    });
    setEditing(false);
  };

  // Handle cancel: reset states to initial data
  const handleCancel = () => {
    setSubject('');
    setSignature('');
    setBody('');

    const contentBlock = htmlToDraft('');
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks,
        contentBlock.entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
    } else {
      setEditorState(EditorState.createEmpty());
    }
    // if (dataInitial.body) {
    //   const contentBlock = htmlToDraft(dataInitial.body);
    //   if (contentBlock) {
    //     const contentState = ContentState.createFromBlockArray(
    //       contentBlock.contentBlocks,
    //       contentBlock.entityMap
    //     );
    //     setEditorState(EditorState.createWithContent(contentState));
    //   }
    // } else {
    //   setEditorState(EditorState.createEmpty());
    // }
    setEditing(false);
  };

  // Handle preview: replace variables in HTML and open dialog
  const handlePreviewEmail = () => {
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    html = variablesExpand(job, html);
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
      onChange: (val) => setBody(val),
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
            }}
          >
            {fields.map(({ label, key, value, onChange, multiline, disabled, helpKey }) => (
              <Box
                key={key}
                sx={{ flex: { xs: '1 1 100%' }, mb: 2}}
              >
                <ContextualHelp helpPagesKey={helpKey} fullWidth showOnHover>
                  {(key === 'body') && !editing && (
                    <TextFieldHtml disabled={true} label={t('Email body')} html={body} minHeight={200} />
                  )}
                  {(key === 'body') && editing && ( // Variable insertion buttons
                    <Box label={t('Email body')}>
                      {variables.map((varName) => (
                        <Chip
                          key={varName}
                          onClick={() => handleInsertVariable(varName)}
                          sx={{
                            bgcolor: '#ffff00',
                            mx: 0.5,
                            mb: 3,
                            border: 1
                          }}
                          label={varName}
                        >
                        </Chip>
                      ))}

                      <Global
                        styles={{
                          '.rdw-editor-toolbar': {
                            backgroundColor: '#a5dc6f !important', // primary.main... TODO: adjust with theme...
                          },
                        }}
                      />
                      <Editor
                        editorState={editorState}
                        onEditorStateChange={onEditorStateChange}
                        toolbar={{
                          options: ['inline'],
                          inline: { options: ['bold', 'italic', 'underline'] },
                        }}
                        editorStyle={{
                          minHeight: '200px',
                          padding: '8px',
                          //padding-top: 0,
                          backgroundColor: editing ? 'red !important'/*#cf4f8'*/ : 'red',
                          pointerEvents: editing ? 'auto' : 'none',
                        }}
                      />
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

          {/* Buttons */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2
          }}>
            {editing && (
              <Button variant="contained" size="small" onClick={handleCancel}>
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
            <Button
              variant="contained"
              size="medium"
              onClick={handlePreviewEmail}
              endIcon={<PreviewIcon />}
            >
              {t('Preview email')}
            </Button>
          </Box>
        </Box>
      </StyledPaper>

      {/* Preview Dialog */}
      <HtmlPreviewDialog
        isOpen={previewIsOpen}
        onClose={() => setPreviewIsOpen(false)}
        subject={subject}
        htmlContent={expandedHtml}
        signature={signature}
      />
    </Container>
  );
};

const HtmlPreviewDialog = ({ isOpen, onClose, subject, htmlContent, signature }) => {
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
          <Box
            sx={{
              overflowY: 'auto',
              p: 2,
              border: '1px solid #ccc',
              mb: 2,
            }}
          >
            <Typography _ariant="h6">
              {/*t('Subject')*/} {subject}
            </Typography>
          </Box>
          
          <Box
            dangerouslySetInnerHTML={{ __html: `${htmlContent} ${signature}` }}
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

import { i18n } from "../i18n";

const variablesExpand = (job, html) => {
  // Variables and their preview values
  const variables = [
    i18n.t('{DOCTOR NAME}'),
    i18n.t('{FIRST AND LAST NAME OF THE PATIENT}'),
    i18n.t('{SIGNATURE OF THE SENDER}'),
    i18n.t('{NAME OF THE MEDICINE}'),
  ];

  variables.forEach((variable) => {
    //const escapedVar = variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedVar = variable;
    let replacement;
    switch (variable) {
      case i18n.t('{DOCTOR NAME}'):
        replacement = job.doctor.name ?? variable;
        break
      case i18n.t('{FIRST AND LAST NAME OF THE PATIENT}'):
        replacement = (job.patient.firstName || job.patient.lastName) ? `${job.patient.firstName} ${job.patient.lastName}` : variable;
        break;
      case i18n.t('{SIGNATURE OF THE SENDER}'):
        replacement = job.emailTemplate.signature ?? variable;
        break;
      case i18n.t('{NAME OF THE MEDICINE}'):
        replacement = (job.medicines && job.medicines[0] && job.medicines[0].name) ? job.medicines[0].name : variable;
        break;
      default:
        console.warning(`Found variable like string ${variable}, but it is not allowed`);
        replacement = variable;
    }
    html = html.replace(new RegExp(escapedVar, 'g'), replacement);
  });

  return html;
}

// eslint-disable-next-line react-refresh/only-export-components
export { variablesExpand };
export default JobEmailTemplate;
