import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor } from 'react-draft-wysiwyg';
import {
  EditorState,
  convertToRaw,
  ContentState,
  Modifier
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, Box, TextField, Typography, Dialog, DialogContent, DialogTitle } from '@mui/material';
import DraftsIcon from '@mui/icons-material/Drafts';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const EmailTemplateEditor = () => {
  const { t } = useTranslation();

  const [subject, setSubject] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [expandedHtml, setExpandedHtml] = useState('');
  const [variables] = useState([
    '{NOME DEL DOTTORE}',
    '{NOME E COGNOME DEL PAZIENTE}',
    '{FIRMA DEL MITTENTE}',
    '{ELENCO DEI FARMACI}'
  ]);
  const [variablesValuesForPreview] = useState([ // TODO: get these values from context, if present
    'Dott.ssa Siringhetti',
    'Culetto Rosa',
    'Mario Rossi (tel.: 333 4567890)',
    ' &emsp;&bullet; Tachipirina 1000<br /> &emsp;&bullet; Aspirina effervescente'
  ]);

  const [previewIsOpen, setPreviewIsOpen] = useState(false);
 
 
  useEffect(() => {
    const htmlTemplate = `
      <p>Buongiorno {NOME DEL DOTTORE},</p>
      <p>Si richiedono i seguenti farmaci per <em>{NOME E COGNOME DEL PAZIENTE}</em>:</p>
      <p>{ELENCO DEI FARMACI}</p>
      <p>Cordiali saluti.\n--\n{FIRMA DEL MITTENTE}</p>
    `;
    const contentBlock = htmlToDraft(htmlTemplate);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks,
      contentBlock.entityMap
    );
    const initialEditorState = EditorState.createWithContent(contentState);
    setEditorState(initialEditorState);
    setSubject('Richiesta prescrizione per {Nome e cognome paziente}');
  }, []);

  const handleInsertVariable = (variable) => {
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

  const handlePreviewEmail = () => {
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    variables.forEach((word, index) => {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const replacement = variablesValuesForPreview[index];
      html = html.replace(new RegExp(escapedWord, 'g'), replacement);
    });
    setExpandedHtml(html);
    setPreviewIsOpen(true);
  };

  const handleGenerateHtml = () => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setGeneratedHtml(html);
    console.log('Subject:', subject);
    console.log('Generated HTML:', html);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label={t('Email subject')}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          variant="outlined"
          _sx={{ mb: 3 }}
        />
      </Box>

      {/* TODO: make a new component: BoxLegendary */}
      <Box component="fieldset" sx={{ border: '1px solid', borderColor: 'grey.400', borderRadius: 1.2, mb: 2 }}>
        <Typography component="legend" variant="caption" sx={{ p: 0.66 }}>
          {t('Email body')}
        </Typography>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          toolbar={{
            options: ['inline'],
            inline: { options: ['bold', 'italic', 'underline'] }
          }}
          editorStyle={{ minHeight: '200px', padding: '8px' }}
          sx={{ mb: 3 }}
        />
      </Box>

      <Box component="fieldset" sx={{ border: '1px solid', borderColor: 'grey.400', borderRadius: 1.2, mb: 2 }}>
        <Typography component="legend" variant="caption" sx={{ p: 0.66 }}>
          {t('Available variables')}
        </Typography>
        {variables.map((varName) => (
          <Button
            key={varName}
            variant="outlined"
            color="primary.contrastText"
            size="small"
            onClick={() => handleInsertVariable(varName)}
            sx={{ bgcolor: "yellow", mx: 0.5, mb: 1 }}
          >
            {varName}
          </Button>
        ))}
      </Box>

      <Button
        variant="contained"
        onClick={handlePreviewEmail}
        sx={{ mr: 2 }}
      >
        {t('Preview email')}
      </Button>

      <Button
        variant="contained"
        onClick={handleGenerateHtml}
        sx={{ mr: 2 }}
      >
        {t('Confirm template')}
      </Button>

      <HtmlPreviewDialog
        isOpen={previewIsOpen}
        onClose={() => setPreviewIsOpen(false)}
        htmlContent={expandedHtml}
      />

      {/* TODO: only for development */}
      {generatedHtml && (
        <Box sx={{ mt: 3, p: 2, border: '1px dashed #ccc' }}>
          <Typography variant="subtitle1">{t('Email subject')}:</Typography>
          <p>{subject}</p>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>HTML Output:</Typography>
          <pre>{generatedHtml}</pre>
        </Box>
      )}
    </Box>
  );
};

const HtmlPreviewDialog = ({ 
  isOpen, 
  onClose, 
  htmlContent 
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
     <DialogTitle sx={{
        bgcolor: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        mb: 2,
      }}>
        {/* Left aligned content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DraftsIcon sx={{
            fontSize: 24,
            color: 'white',
            mx: 1,
          }} />
          <span style={{ color: 'white' }}>{t('Email preview')}</span>
        </div>

        {/* Right-aligned close button */}
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
        >
          <CloseIcon sx={{ color: 'white' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Safe way to render HTML content */}
        <Box 
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          sx={{
            minHeight: '200px',
            overflowY: 'auto',
            p: 2,
            border: '1px solid #ccc'
          }} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmailTemplateEditor;
