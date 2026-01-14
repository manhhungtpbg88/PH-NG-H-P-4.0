
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { X, Upload, Sparkles, FileText, Edit2 } from 'lucide-react';
import { summarizeMeetingContent } from '../services/geminiService';
import { MeetingDocument } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (data: { 
    order: number; 
    content: string; 
    presenter: string; 
    fileName: string; 
    fileData: string;
    aiSummary?: string;
  }) => void;
  initialData?: MeetingDocument | null;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload, initialData }) => {
  const [order, setOrder] = useState<number>(1);
  const [content, setContent] = useState('');
  const [presenter, setPresenter] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState('');

  useEffect(() => {
    if (initialData) {
      setOrder(initialData.order);
      setContent(initialData.content);
      setPresenter(initialData.presenter);
      setAiSummary(initialData.aiSummary || '');
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerateSummary = async () => {
    if (!content) return;
    setIsGenerating(true);
    const summary = await summarizeMeetingContent(content);
    setAiSummary(summary);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !presenter) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpload({
          order,
          content,
          presenter,
          fileName: file.name,
          fileData: reader.result as string,
          aiSummary
        });
      };
      reader.readAsDataURL(file);
    } else if (initialData) {
      // Trường hợp sửa và không thay đổi file
      onUpload({
        order,
        content,
        presenter,
        fileName: initialData.fileName,
        fileData: initialData.fileData || '',
        aiSummary
      });
    }
  };

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {isEdit ? <Edit2 className="text-blue-600" size={24} /> : <Upload className="text-blue-600" size={24} />}
            {isEdit ? 'Chỉnh sửa nội dung' : 'Đẩy tài liệu mới'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">STT</label>
              <input 
                type="number" 
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="flex-[3]">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Người trình bày</label>
              <input 
                type="text" 
                placeholder="VD: Nguyễn Văn A"
                value={presenter}
                onChange={(e) => setPresenter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung họp</label>
            <textarea 
              rows={3}
              placeholder="Nhập chi tiết nội dung thảo luận..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              required
            />
            <div className="mt-2 flex items-center justify-between">
              <Button 
                type="button" 
                variant="ghost" 
                className="text-xs text-blue-600 px-2 py-1"
                onClick={handleGenerateSummary}
                disabled={!content || isGenerating}
                isLoading={isGenerating}
              >
                <Sparkles size={14} />
                Dùng AI tóm tắt
              </Button>
            </div>
          </div>

          {aiSummary && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Tóm tắt bởi AI</div>
              <p className="text-sm text-blue-800 italic">{aiSummary}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {isEdit ? 'Thay đổi file tài liệu (Để trống nếu giữ nguyên)' : 'Tải file lên'}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors cursor-pointer relative">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Chọn tệp tin</span>
                    <input type="file" className="sr-only" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">hoặc kéo thả vào đây</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOCX, XLSX (Tối đa 10MB)</p>
              </div>
            </div>
            {(file || (isEdit && initialData)) && (
              <div className="mt-2 text-sm text-blue-600 flex items-center gap-2 font-medium bg-blue-50 p-2 rounded border border-blue-100">
                <FileText size={16} /> {file ? file.name : initialData?.fileName}
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Hủy</Button>
            <Button type="submit" className="flex-1" disabled={(!file && !isEdit) || !content || !presenter}>
              {isEdit ? 'Lưu thay đổi' : 'Tải lên ngay'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
