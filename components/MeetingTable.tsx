
import React from 'react';
import { MeetingDocument } from '../types';
import { FileText, User, Info, Trash2, Eye, Download, Edit2 } from 'lucide-react';

interface MeetingTableProps {
  documents: MeetingDocument[];
  isAdmin: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (doc: MeetingDocument) => void;
  onPreview?: (doc: MeetingDocument) => void;
}

const MeetingTable: React.FC<MeetingTableProps> = ({ documents, isAdmin, onDelete, onEdit, onPreview }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 font-semibold text-gray-600 text-sm w-20">STT</th>
            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Nội dung</th>
            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Người trình bày</th>
            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">File tài liệu</th>
            {isAdmin && <th className="px-6 py-4 font-semibold text-gray-600 text-sm w-32 text-center">Tác vụ</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {documents.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 5 : 4} className="px-6 py-10 text-center text-gray-400">
                Chưa có tài liệu nào trong cuộc họp này.
              </td>
            </tr>
          ) : (
            documents.sort((a,b) => a.order - b.order).map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 text-gray-500 font-medium">{doc.order}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium">{doc.content}</span>
                    {doc.aiSummary && (
                      <div className="mt-1 flex items-start gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
                        <span className="mt-0.5 shrink-0"><Info size={14} /></span>
                        <span><strong>AI Tóm tắt:</strong> {doc.aiSummary}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User size={16} />
                    </div>
                    <span>{doc.presenter}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onPreview?.(doc)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium group/file px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      title="Xem trước tài liệu"
                    >
                      <FileText size={18} />
                      <span className="truncate max-w-[120px]">{doc.fileName}</span>
                      <Eye size={14} className="opacity-0 group-hover/file:opacity-100 transition-opacity" />
                    </button>
                    
                    <a 
                      href={doc.fileData} 
                      download={doc.fileName}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                      title="Tải tài liệu về"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => onEdit?.(doc)}
                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Sửa tài liệu"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete?.(doc.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Xóa tài liệu"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MeetingTable;
