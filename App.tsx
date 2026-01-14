
import React, { useState, useEffect } from 'react';
import { AuthState, User, MeetingDocument, Attachment } from './types';
import { VALID_USERS, GUEST_USER } from './constants';
import Button from './components/Button';
import MeetingTable from './components/MeetingTable';
import UploadModal from './components/UploadModal';
import FilePreviewModal from './components/FilePreviewModal';
import { LogOut, Plus, Settings, Monitor, FileBarChart, Paperclip, Trash2, Download, FileText, Lock, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState<MeetingDocument[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<MeetingDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<MeetingDocument | Attachment | null>(null);

  useEffect(() => {
    const savedDocs = localStorage.getItem('meeting_docs');
    if (savedDocs) setDocuments(JSON.parse(savedDocs));

    const savedAttachments = localStorage.getItem('meeting_attachments');
    if (savedAttachments) setAttachments(JSON.parse(savedAttachments));

    const savedAuth = localStorage.getItem('meeting_auth');
    if (savedAuth) setAuth(JSON.parse(savedAuth));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Nếu là admin/admin thì vào quyền quản trị
    if (username.toLowerCase() === 'admin' && password === 'admin') {
      const adminUser = VALID_USERS.find(u => u.username === 'admin')!;
      const newAuth = { user: adminUser, isAuthenticated: true };
      setAuth(newAuth);
      localStorage.setItem('meeting_auth', JSON.stringify(newAuth));
      setError('');
    } 
    // Nếu ấn đăng nhập ngay (hoặc nhập bất kỳ mà không phải admin/admin) thì vào quyền thành viên
    else {
      const newAuth = { user: GUEST_USER, isAuthenticated: true };
      setAuth(newAuth);
      localStorage.setItem('meeting_auth', JSON.stringify(newAuth));
      setError('');
    }
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('meeting_auth');
    setUsername('');
    setPassword('');
  };

  const handleSaveDocument = (data: any) => {
    let updatedDocs: MeetingDocument[];
    
    if (editingDoc) {
      updatedDocs = documents.map(d => 
        d.id === editingDoc.id ? { ...d, ...data } : d
      );
    } else {
      const newDoc: MeetingDocument = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString()
      };
      updatedDocs = [...documents, newDoc];
    }
    
    setDocuments(updatedDocs);
    localStorage.setItem('meeting_docs', JSON.stringify(updatedDocs));
    setShowUploadModal(false);
    setEditingDoc(null);
  };

  const handleDeleteDocument = (id: string) => {
    const updatedDocs = documents.filter(d => d.id !== id);
    setDocuments(updatedDocs);
    localStorage.setItem('meeting_docs', JSON.stringify(updatedDocs));
  };

  const handleEditDocument = (doc: MeetingDocument) => {
    setEditingDoc(doc);
    setShowUploadModal(true);
  };

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        fileName: file.name,
        fileData: reader.result as string,
        uploadedAt: new Date().toISOString()
      };
      const updated = [...attachments, newAttachment];
      setAttachments(updated);
      localStorage.setItem('meeting_attachments', JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDeleteAttachment = (id: string) => {
    const updated = attachments.filter(a => a.id !== id);
    setAttachments(updated);
    localStorage.setItem('meeting_attachments', JSON.stringify(updated));
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/95 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl overflow-hidden">
            <div className="text-center mb-10">
              <div className="mb-4 inline-block px-4 py-1.5 rounded-full bg-red-50 border border-red-100 shadow-sm">
                <span className="text-red-700 font-bold tracking-widest text-sm uppercase">Đảng ủy phường Tân Tiến</span>
              </div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">PHÒNG HỌP 4.0</h1>
              <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tên tài khoản</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập ID (Ví dụ: admin)"
                    className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-slate-100 border-none text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-slate-100 border-none text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium text-center border border-red-100">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <Button type="submit" className="w-full py-4 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/30 rounded-2xl">
                  Đăng nhập ngay
                </Button>
                <p className="text-center text-xs text-slate-400 mt-4 px-6">
                  * Nhấn Đăng nhập ngay để vào chế độ Thành viên, hoặc dùng tài khoản Quản trị để quản lý.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = auth.user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Monitor size={24} />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-tight">ĐẢNG ỦY PHƯỜNG TÂN TIẾN</h1>
                <p className="text-xs text-gray-500">Phòng họp 4.0 - <span className="font-mono text-blue-600">MEET-2024</span></p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-gray-800">{auth.user?.displayName}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{isAdmin ? 'Quản trị viên' : 'Thành viên'}</span>
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all" title="Đăng xuất">
                <LogOut size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <FileBarChart size={24} />
             </div>
             <div>
                <p className="text-sm text-gray-500">Nội dung trình bày</p>
                <p className="text-xl font-bold text-gray-900">{documents.length} Mục</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Settings size={24} />
             </div>
             <div>
                <p className="text-sm text-gray-500">Trạng thái hệ thống</p>
                <p className="text-xl font-bold text-gray-900">Đang diễn ra</p>
             </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">1. Nội dung & Chương trình họp</h2>
              <p className="text-sm text-gray-500">Các nội dung chính được thảo luận và trình bày trong buổi họp.</p>
            </div>
            {isAdmin && (
              <Button onClick={() => { setEditingDoc(null); setShowUploadModal(true); }} className="shadow-md">
                <Plus size={18} />
                Thêm nội dung
              </Button>
            )}
          </div>
          <MeetingTable 
            documents={documents} 
            isAdmin={isAdmin} 
            onDelete={handleDeleteDocument}
            onEdit={handleEditDocument}
            onPreview={(doc) => setPreviewDoc(doc)}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Paperclip className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-gray-800">2. Tài liệu đính kèm thêm</h2>
            </div>
            {isAdmin && (
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus size={16} />
                Tải lên file
                <input type="file" className="hidden" onChange={handleAddAttachment} />
              </label>
            )}
          </div>
          <div className="p-6">
            {attachments.length === 0 ? (
              <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                Không có tài liệu đính kèm bổ sung.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {attachments.map((file) => (
                  <div key={file.id} className="group relative flex items-center p-3 border border-gray-100 rounded-xl hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className="text-sm font-semibold text-gray-800 truncate" title={file.fileName}>{file.fileName}</p>
                      <button 
                        onClick={() => setPreviewDoc(file as any)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Xem nhanh
                      </button>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <a href={file.fileData} download={file.fileName} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                        <Download size={16} />
                      </a>
                      {isAdmin && (
                        <button onClick={() => handleDeleteAttachment(file.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center">
         <p className="text-sm text-gray-500 font-medium">Đảng ủy phường Tân Tiến - Hệ thống Phòng họp Không giấy</p>
         <p className="text-[10px] text-gray-400 uppercase mt-1 tracking-widest italic">Digital Transformation Service 2024</p>
      </footer>

      {showUploadModal && (
        <UploadModal 
          onClose={() => { setShowUploadModal(false); setEditingDoc(null); }} 
          onUpload={handleSaveDocument}
          initialData={editingDoc}
        />
      )}
      {previewDoc && <FilePreviewModal doc={previewDoc as any} onClose={() => setPreviewDoc(null)} />}
    </div>
  );
};

export default App;
