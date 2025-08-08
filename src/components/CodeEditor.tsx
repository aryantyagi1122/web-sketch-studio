
import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectFile } from '@/types/project';
import { useCollaboration } from '@/hooks/useCollaboration';
import { debounce } from 'lodash-es';

interface CodeEditorProps {
  file: ProjectFile;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file, readOnly = false }) => {
  const { updateFile, currentProject } = useProject();
  const editorRef = useRef<any>(null);
  const [isExternalChange, setIsExternalChange] = useState(false);
  
  const { broadcastFileChange } = useCollaboration({
    projectId: currentProject?.id || '',
    currentFileId: file.id
  });

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Debounced function to broadcast changes
  const debouncedBroadcast = debounce((fileId: string, content: string) => {
    broadcastFileChange(fileId, content);
  }, 500);

  const handleEditorChange = (value: string | undefined) => {
    if (readOnly || isExternalChange) return;
    if (value !== undefined) {
      updateFile(file.id, value);
      
      // Broadcast change to other collaborators
      debouncedBroadcast(file.id, value);
    }
  };

  // Listen for external file changes from other collaborators
  useEffect(() => {
    const handleExternalChange = (event: CustomEvent) => {
      const { files, user_id } = event.detail;
      
      if (!files || !Array.isArray(files)) return;
      
      const updatedFile = files.find((f: any) => f.id === file.id);
      if (updatedFile && updatedFile.content !== file.content) {
        setIsExternalChange(true);
        
        // Update the editor content
        if (editorRef.current) {
          const currentPosition = editorRef.current.getPosition();
          editorRef.current.setValue(updatedFile.content);
          editorRef.current.setPosition(currentPosition);
        }
        
        setTimeout(() => setIsExternalChange(false), 100);
      }
    };

    window.addEventListener('collaboration-file-change', handleExternalChange as EventListener);
    
    return () => {
      window.removeEventListener('collaboration-file-change', handleExternalChange as EventListener);
    };
  }, [file.id, file.content]);

  const getLanguage = (type: string) => {
    switch (type) {
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'js':
        return 'javascript';
      default:
        return 'javascript';
    }
  };

  return (
    <div className="h-full relative">
      <Editor
        height="100%"
        language={getLanguage(file.type)}
        value={file.content}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          readOnly: readOnly,
          domReadOnly: readOnly,
          cursorStyle: readOnly ? 'block-outline' : 'line',
        }}
      />
      {readOnly && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs">
          Read Only
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
