import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';

export const ShareModal = ({ note, onShare, onRevoke, onClose, isLoading }) => {
  const [sharePrincipal, setSharePrincipal] = useState('');
  const [permission, setPermission] = useState('Read');

  const handleShare = () => {
    if (!sharePrincipal.trim()) return;
    onShare(note.id, sharePrincipal, permission);
    setSharePrincipal('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Share "{note.title}"</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Share with new user</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={sharePrincipal}
                onChange={(e) => setSharePrincipal(e.target.value)}
                placeholder="Enter Principal ID"
                className="flex-grow p-2 border rounded"
                disabled={isLoading}
              />
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="p-2 border rounded"
                disabled={isLoading}
              >
                <option value="Read">Read</option>
                <option value="Write">Write</option>
              </select>
              <button
                onClick={handleShare}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                disabled={isLoading}
              >
                Share
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Shared with</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {Object.entries(note.shared_with || {}).length > 0 ? (
                Object.entries(note.shared_with || {}).map(([principal, perm]) => (
                  <div key={principal} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <span className="text-sm font-mono truncate" title={principal}>{principal}</span>
                    <div className="flex items-center space-x-2">
                       <span className="text-sm text-gray-600">{perm.Read ? 'Read' : 'Write'}</span>
                       <button onClick={() => onRevoke(note.id, principal)} className="p-1 text-red-500 hover:text-red-700" disabled={isLoading}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Not shared with anyone yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 