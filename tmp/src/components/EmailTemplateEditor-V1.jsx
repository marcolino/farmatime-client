import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, Box } from '@mui/material';



const EmailTemplateEditor = () => {
  const { t } = useTranslation();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [variables] = useState(['{Nome del dottore}', '{Nome e cognome paziente}', '{Telefono da contattare}', '{Elenco dei farmaci}']);
  const [generatedHtml, setGeneratedHtml] = useState('');

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
    // You might want to send this to your backend or preview it
    console.log('Generated HTML:', html);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        onLoad={() => {
          return (
            <>
              Ciao
            </>
          );
        }}
        toolbar={{
          options: ['inline', /*'blockType',*/ /*'list', */ /*'textAlign', */ /*'link'*/],
          inline: { options: ['bold', 'italic', 'underline'] }
        }}
      />
      
      <Box sx={{ mb: 2 }}>
        <strong>{t('Variables')}: </strong>
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
}

export default EmailTemplateEditor;
