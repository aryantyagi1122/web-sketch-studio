
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, FileText, Palette, Code } from 'lucide-react';
import { FileType } from '@/types/project';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FileTabsProps {
  readOnly?: boolean;
}

const FileTabs: React.FC<FileTabsProps> = ({ readOnly = false }) => {
  const { currentProject, currentFile, setCurrentFile, addFile, removeFile } = useProject();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<FileType>('js');

  if (!currentProject) return null;

  const handleFileSelect = (fileId: string) => {
    const file = currentProject.files.find(f => f.id === fileId);
    if (file) {
      setCurrentFile(file);
    }
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }

    if (readOnly) {
      toast.error("You can't add files to this project. Only the owner can make changes.");
      return;
    }

    let finalFileName = newFileName.trim();
    
    // Add extension if not provided
    const extension = getExtensionForType(newFileType);
    if (!finalFileName.endsWith(`.${extension}`)) {
      finalFileName += `.${extension}`;
    }

    addFile(finalFileName, newFileType);
    setNewFileName('');
    setIsAddDialogOpen(false);
  };

  const handleRemoveFile = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    
    if (readOnly) {
      toast.error("You can't remove files from this project. Only the owner can make changes.");
      return;
    }
    
    removeFile(fileId);
  };

  const getExtensionForType = (type: FileType): string => {
    switch (type) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': return 'js';
      default: return 'js';
    }
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'html':
        return <FileText size={16} className="text-orange-500" />;
      case 'css':
        return <Palette size={16} className="text-blue-500" />;
      case 'js':
        return <Code size={16} className="text-yellow-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center bg-gray-800 border-b border-gray-700 overflow-x-auto">
      <div className="flex">
        {currentProject.files.map((file) => (
          <div
            key={file.id}
            className={`flex items-center px-3 py-2 cursor-pointer border-r border-gray-700 min-w-0 ${
              currentFile?.id === file.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => handleFileSelect(file.id)}
          >
            {getFileIcon(file.type)}
            <span className="ml-2 text-sm truncate max-w-[120px]">{file.name}</span>
            {!readOnly && currentProject.files.length > 1 && (
              <button
                onClick={(e) => handleRemoveFile(e, file.id)}
                className="ml-2 text-gray-400 hover:text-red-400 flex-shrink-0"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      {!readOnly && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Plus size={16} className="mr-1" />
              Add File
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">File Name</label>
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Enter file name"
                  className="mt-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddFile();
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium">File Type</label>
                <Select value={newFileType} onValueChange={(value: FileType) => setNewFileType(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="js">JavaScript</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddFile}>
                  Add File
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FileTabs;
