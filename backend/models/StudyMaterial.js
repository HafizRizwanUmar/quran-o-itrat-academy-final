const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Material title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Material description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  // File-related fields for uploaded files
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  originalFileName: {
    type: String,
    required: [true, 'Original file name is required'],
    trim: true
  },
  filePath: {
    type: String,
    required: [true, 'File path is required'],
    trim: true
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    trim: true,
    lowercase: true
  },
  fileSize: {
    type: String,
    required: [true, 'File size is required'],
    trim: true
  },
  // Legacy fields for backward compatibility (optional)
  fileUrl: {
    type: String,
    trim: true
  },
  lessonNumber: {
    type: Number,
    min: [1, 'Lesson number must be at least 1']
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: [0, 'Download count cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
studyMaterialSchema.index({ title: 'text', description: 'text' });

// Virtual for file URL (for API compatibility)
studyMaterialSchema.virtual('downloadUrl').get(function() {
  return `/api/study-materials/${this._id}/download`;
});

// Ensure virtual fields are serialized
studyMaterialSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);

