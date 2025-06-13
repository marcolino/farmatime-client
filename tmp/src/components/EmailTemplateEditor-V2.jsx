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
import { Button, Box } from '@mui/material';

const EmailTemplateEditor = () => {
  const { t } = useTranslation();
  
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [variables] = useState([
    '{Nome del dottore}',
    '{Nome e cognome del paziente}',
    '{Firma del mittente}',
    '{Elenco dei farmaci}'
  ]);

  // ✅ Load the template HTML on mount
  useEffect(() => {
    const htmlTemplate = `
      <p>Buongiorno {Nome del Dottore},</p>
      <p>Si richiedono i seguenti farmaci per {Nome e cognome del paziente}</p>
      <p>{Elenco dei farmaci}</p>
      <p>Cordiali saluti.\n--\n{Firma del mittente}</p>
    `;
    const contentBlock = htmlToDraft(htmlTemplate);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks,
      contentBlock.entityMap
    );
    const initialEditorState = EditorState.createWithContent(contentState);
    setEditorState(initialEditorState);
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

  const handleGenerateHtml = () => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setGeneratedHtml(html);
    console.log('Generated HTML:', html);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <strong>{t('Variables')}:</strong>
        {variables.map((varName) => (
          <Button
            key={varName}
            variant="outlined"
            color="success"
            size="small"
            onClick={() => handleInsertVariable(varName)}
            sx={{ mx: 0.5, pb: 0.5 }}
          >
            {varName}
          </Button>
        ))}
      </Box>
      
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        toolbar={{
          options: ['inline'],
          inline: { options: ['bold', 'italic', 'underline'] }
        }}
      />
      
      <Button 
        variant="contained" 
        onClick={handleGenerateHtml}
        sx={{ mt: 2 }}
      >
        {t('Confirm template')}
      </Button>
      
      {generatedHtml && (
        <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc' }}>
          <h4>HTML Output:</h4>
          <pre>{generatedHtml}</pre>
        </Box>
      )}
    </Box>
  );
};

export default EmailTemplateEditor;
