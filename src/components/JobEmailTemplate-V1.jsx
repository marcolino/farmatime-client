import { useState, useEffect, useContext } from 'react';
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
  //TextFieldHtml,
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
import { AuthContext } from "../providers/AuthContext";
import { JobContext } from '../providers/JobContext';
import { useSnackbarContext } from "../providers/SnackbarProvider";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import config from '../config';

const JobEmailTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { job, setJob, jobError } = useContext(JobContext);
  const { showSnackbar } = useSnackbarContext();
  const { auth } = useContext(AuthContext);
  
  // Get email template data from job context
  const data = job?.emailTemplate || {};
  
  // States for controlled fields
  const [subject, setSubject] = useState(data.subject || '');
  const [body, setBody] = useState(data.body || '');
  //const [signature, setSignature] = useState(data.signature || '');

  // EditorState for body
  const [editorState, setEditorState] = useState(() => {
    if (data.body) {
      console.log("DATA:.BODY:", data.body);

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
  
  // Preview dialog state
  const [previewIsOpen, setPreviewIsOpen] = useState(false);
  const [expandedHtml, setExpandedHtml] = useState('');

  // Initialize editorState from bodyHtml
  useEffect(() => {
    //if (editing) {
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
    //}
  }, [/*editing,*/ body]);

  // Handle variable insertion in editor
  const handleInsertVariable = (variable) => {
    //if (!editing) return;
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

  // Handle confirm: update job context with new email template data
  const handleConfirm = () => {
    const updatedEmailTemplate = {
      subject,
      body,
      //signature,
    };
    
    // Update job context
    setJob(prevJob => ({
      ...prevJob,
      emailTemplate: {
        ...prevJob.emailTemplate,
        ...updatedEmailTemplate
      }
    }));
    
    //setEditing(false);
    showSnackbar(t('Email template updated successfully') + '.');
    setTimeout(() => {
      navigate(-1); // navigate back to the previous page
    }, ((config.ui.snacks.autoHideDurationSeconds + 0.5) * 1000));
  };

  // Handle cancel: reset states to current job data
  const handleCancel = () => {
    const currentEmailTemplate = job?.emailTemplate || {};
    
    setSubject(currentEmailTemplate.subject || '');
    //setSignature(currentEmailTemplate.signature || '');
    setBody(currentEmailTemplate.body || '');

    if (currentEmailTemplate.body) {
      const contentBlock = htmlToDraft(currentEmailTemplate.body);
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
    
    //setEditing(false);
    navigate(-1);
  };

  // Handle preview: replace variables in HTML and open dialog
  const handlePreviewEmail = () => {
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    html = variablesExpand(job, html, auth);
    setExpandedHtml(html);
    setPreviewIsOpen(true);
  };

  // Show error state if job context has errors
  if (jobError) {
    return (
      <Container maxWidth="lg" sx={{ py: 0 }}>
        <StyledPaper>
          <StyledBox>
            <Typography variant="h5" fontWeight="bold" color="error">
              {t('Error loading job data')}
            </Typography>
            <Typography variant="body2" color="error">
              {jobError.message || t('An error occurred while loading job information')}
            </Typography>
          </StyledBox>
        </StyledPaper>
      </Container>
    );
  }

  // Show loading state if job is not yet available
  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ py: 0 }}>
        <StyledPaper>
          <StyledBox>
            <Typography variant="h5" fontWeight="bold">
              {t('Loading...')}
            </Typography>
          </StyledBox>
        </StyledPaper>
      </Container>
    );
  }

  // Fields configuration for subject (plain TextField)
  const fields = [
    {
      label: t('Email subject'),
      key: 'subject',
      value: subject,
      onChange: (val) => setSubject(val),
      multiline: false,
      //disabled: !editing,
      helpKey: 'EmailTemplateSubject',
    },
    {
      label: t("Email body"),
      key: 'body',
      onChange: (val) => setBody(val),
      multiline: true,
      //disabled: !editing,
      helpKey: 'EmailTemplateBody',
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
          {/* Subject field */}
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
                  {/* {(key === 'body') && !editing && (
                    <TextFieldHtml disabled={true} label={t('Email body')} html={body} minHeight={200} />
                  )} */}
                  {(key === 'body') /*&& editing*/ && (
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
                            backgroundColor: '#a5dc6f !important',
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
                          //backgroundColor: editing ? 'red !important' : 'red',
                          //backgroundColor: 'red !important',
                          //pointerEvents: editing ? 'auto' : 'none',
                          pointerEvents: 'auto',
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
            {/*editing && (*/}
              <Button variant="contained" size="small" onClick={handleCancel}>
                {t('Cancel')}
              </Button>
            {/*)*/}

            <Button
              variant="contained"
              size="medium"
              //onClick={editing ? handleConfirm : () => setEditing(true)}
              onClick={handleConfirm}
              endIcon={<EditIcon />}
            >
              {/* {editing ? t('Confirm changes') : t('Edit email template')} */}
              {t('Confirm changes')}
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
        //signature={signature}
      />
    </Container>
  );
};

const HtmlPreviewDialog = ({ isOpen, onClose, subject, htmlContent/*, signature*/ }) => {
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);

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
            dangerouslySetInnerHTML={{ __html: htmlContent/*${signature}*/ }}
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

const variables = [ // TODO: to config
  i18n.t('{DOCTOR NAME}'),
  i18n.t('{FIRST AND LAST NAME OF THE PATIENT}'),
  //i18n.t('{SIGNATURE OF THE SENDER}'),
  i18n.t('{NAME OF THE MEDICINE}'),
  //i18n.t('{PATIENT NAME}'),
  //i18n.t('{PATIENT SURNAME}'),
  i18n.t('{FIRST AND LAST NAME OF THE USER}'),
  i18n.t('{EMAIL OF THE USER}'),
];

const variablesExpand = (job, html, auth) => {
  variables.forEach((variable) => {
    const escapedVar = variable;
    let replacement;
    switch (variable) {
      case i18n.t('{DOCTOR NAME}'):
        replacement = job.doctor.name ?? variable;
        break
      case i18n.t('{FIRST AND LAST NAME OF THE PATIENT}'):
        replacement = (job.patient.firstName || job.patient.lastName) ? `${job.patient.firstName} ${job.patient.lastName}` : variable;
        break;
      // case i18n.t('{EMAIL OF THE PATIENT}'):
      //   replacement = job.patient.email ?? variable;
      //   break;
      // case i18n.t('{SIGNATURE OF THE SENDER}'):
      //   replacement = job.emailTemplate.signature ?? variable;
      //   break;
      case i18n.t('{NAME OF THE MEDICINE}'):
        replacement = (job.medicines && job.medicines[0] && job.medicines[0].name) ? job.medicines[0].name : variable;
        break;
      case i18n.t('{FIRST AND LAST NAME OF THE USER}'):
        replacement = (auth?.user?.firstName && auth?.user?.lastName) ? `${auth.user.firstName} ${auth.user.lastName}` : variable;
        break;
      case i18n.t('{EMAIL OF THE USER}'):
        replacement = auth?.user?.email ?? variable;
        break;
      default:
        console.warn(`Found variable like string ${variable}, but it is not allowed`);
        replacement = variable;
    }
    html = html.replace(new RegExp(escapedVar, 'g'), replacement);
  });

  return html;
}

// eslint-disable-next-line react-refresh/only-export-components
export { variablesExpand };
export default JobEmailTemplate;
