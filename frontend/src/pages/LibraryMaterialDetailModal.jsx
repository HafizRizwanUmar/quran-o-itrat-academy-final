import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { libraryAPI } from '../lib/api';
import { BookOpen, Headphones, Video, FileText, Download, User, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const LibraryMaterialDetailModal = ({ materialId, isOpen, onClose }) => {
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && materialId) {
      const fetchMaterialDetail = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await libraryAPI.getById(materialId);
          setMaterial(response.data.data);
        } catch (err) {
          console.error('Error fetching material details:', err);
          setError('Failed to load material details. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      fetchMaterialDetail();
    }
  }, [isOpen, materialId]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'books':
        return BookOpen;
      case 'audio':
        return Headphones;
      case 'video':
        return Video;
      case 'documents':
        return FileText;
      default:
        return FileText;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'books':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'audio':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'video':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'documents':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleDownload = async () => {
    try {
      const downloadUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/library/${materialId}/download`;
      window.open(downloadUrl, '_blank');
    } catch (err) {
      console.error('Error initiating download:', err);
      alert('Failed to initiate download. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          {loading && <DialogTitle>Loading Material...</DialogTitle>}
          {error && <DialogTitle className="text-red-500">Error</DialogTitle>}
          {material && (
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {material.title}
            </DialogTitle>
          )}
        </DialogHeader>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading details...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        ) : material ? (
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {React.createElement(getCategoryIcon(material.category), { className: "h-6 w-6 text-blue-600" })}
                <Badge className={`${getCategoryColor(material.category)} border font-medium`}>
                  {material.category}
                </Badge>
              </div>
              {material.author && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  <span>{material.author}</span>
                </div>
              )}
            </div>
            <DialogDescription className="text-gray-700 leading-relaxed">
              {material.description}
            </DialogDescription>
            <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{material.fileSize}</span>
              </div>
              <div className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                <span>{material.downloadCount} downloads</span>
              </div>
            </div>
            <Button onClick={handleDownload} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              <Download className="h-5 w-5 mr-2" /> Download Material
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default LibraryMaterialDetailModal;

