import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { FiX, FiInfo } from 'react-icons/fi';

export const PdfPreviewModal = ({ isOpen, onClose, previewUrl, title }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <h3 className="font-bold flex items-center gap-2">
              <span className="text-[hsl(var(--primary))]">Preview:</span> {title}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-[hsl(var(--muted))] rounded-full">
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-full text-xs backdrop-blur-md border border-white/10 flex items-center gap-2">
              <SafeIcon icon={FiInfo} />
              Viewing first 10 pages of the sample
            </div>
            
            {previewUrl ? (
              <iframe
                src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-[hsl(var(--muted-foreground))]">
                No preview available for this title.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};