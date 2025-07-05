import { X, History } from 'lucide-react';

export const VersionHistoryModal = ({ note, versions, onRevert, onClose, formatDate, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Version History for "{note.title}"</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {versions && versions.length > 0 ? (
            versions.map((version, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-start">
                <div className="prose prose-sm max-w-none">
                    <p>{version.content}</p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-xs text-gray-500 mb-2">{formatDate(version.updated_at)}</p>
                  <button
                    onClick={() => onRevert(note.id, index)}
                    className="flex items-center text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={isLoading}
                  >
                    <History size={14} className="mr-1" />
                    Restore
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No version history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}; 