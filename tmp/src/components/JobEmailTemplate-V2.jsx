import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const html = '<b>bold</b> <i>italic</i> normal';
const contentBlock = htmlToDraft(html);
console.log("contentBlock:", JSON.stringify(contentBlock));
const contentState = ContentState.createFromBlockArray(
  contentBlock.contentBlocks,
  contentBlock.entityMap
);
const initialEditorState = EditorState.createWithContent(contentState);


export default function MinimalDraftTest() {
  const [editorState, setEditorState] = useState(initialEditorState);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        toolbar={{
          options: ["inline"],
          inline: { options: ["bold", "italic", "underline"] },
        }}
        editorStyle={{
          minHeight: "200px",
          padding: "8px",
          background: "#fff",
        }}
      />
    </div>
  );
}

const variablesExpand = (job, html, auth) => {
  return html;
}

export { variablesExpand };