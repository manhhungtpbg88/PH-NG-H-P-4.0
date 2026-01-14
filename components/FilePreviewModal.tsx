
import React from 'react';
import { MeetingDocument } from '../types';
import { X, Download, FileText, ExternalLink } from 'lucide-react';
import Button from './Button';

interface FilePreviewModalProps {
  doc: MeetingDocument;
  onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ doc, onClose }) => {
  const isImage = doc.fileData?.startsWith('data:image/');
  const isPdf = doc.fileData?.startsWith('data:application/pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
              <FileText size={20} />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-lg font-bold text-gray-800 truncate" title={doc.fileName}>
                {doc.fileName}
              </h2>
              <p className="text-xs text-gray-500">Người trình bày: {doc.presenter}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={doc.fileData} 
              download={doc.fileName}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
              title="Tải về máy"
            >
              <Download size={20} />
            </a>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
              title="Đóng"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 p-4 flex items-center justify-center">
          {isImage ? (
            <img 
              src={doc.fileData} 
              alt={doc.fileName} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-md"
            />
          ) : isPdf ? (
            <iframe 
              src={doc.fileData} 
              className="w-full h-full border-0 rounded-lg shadow-md bg-white"
              title="PDF Preview"
            />
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md">
              <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Không hỗ trợ xem trực tiếp</h3>
              <p className="text-gray-500 mb-8">
                Định dạng tệp này không thể hiển thị xem trước. Vui lòng tải về máy để xem nội dung chi tiết.
              </p>
              <a href={doc.fileData} download={doc.fileName} className="block w-full">
                <Button variant="primary" className="w-full py-3">
                  <Download size={18} />
                  Tải xuống tệp tin
                </Button>
              </a>
            </div>
          )}
        </div>

        {doc.aiSummary && (
          <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 shrink-0">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1 bg-blue-600 text-white rounded shrink-0">
                <ExternalLink size={12} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-0.5">Tóm tắt nội dung tài liệu</h4>
                <p className="text-sm text-blue-900 leading-relaxed">{doc.aiSummary}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreviewModal;
