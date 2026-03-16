const LibraryMaterial = require('../models/LibraryMaterial');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper — normalize material so URLs are absolute for the frontend
const normalize = (material) => {
  if (!material) return material;
  const obj = material.toObject ? material.toObject() : { ...material };
  const backendUrl = process.env.BACKEND_URL || '';
  
  if (obj.fileUrl && obj.fileUrl.startsWith('/uploads') && backendUrl) {
    obj.fileUrl = `${backendUrl.replace(/\/$/, '')}${obj.fileUrl}`;
  }
  
  return obj;
};

// @desc    Get all library materials
// @route   GET /api/library
// @access  Public
const getLibraryMaterials = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const materials = await LibraryMaterial.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await LibraryMaterial.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: materials.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: materials.map(normalize)
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching library materials'
    });
  }
};

// @desc    Get single library material
// @route   GET /api/library/:id
// @access  Public
const getLibraryMaterial = async (req, res) => {
  try {
    const material = await LibraryMaterial.findOne({ _id: req.params.id, isActive: true });
    
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Library material not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: normalize(material)
    });
  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching library material'
    });
  }
};

// @desc    Download library material
// @route   GET /api/library/:id/download
// @access  Public
const downloadLibraryMaterial = async (req, res) => {
  try {
    const material = await LibraryMaterial.findOne({ _id: req.params.id, isActive: true });
    
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Library material not found'
      });
    }
    
    // Construct the full file path
    const filePath = path.join(__dirname, '..', material.fileUrl);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found on server'
      });
    }
    
    // Update download count
    await LibraryMaterial.findByIdAndUpdate(req.params.id, {
      $inc: { downloadCount: 1 }
    });
    
    // Set appropriate headers for file download
    const filename = `${material.title}.${material.fileType}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Error downloading file'
        });
      }
    });
    
  } catch (error) {
    console.error('Error downloading material:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while downloading material'
    });
  }
};

// @desc    Create library material
// @route   POST /api/library
// @access  Private/Admin
const createLibraryMaterial = async (req, res) => {
  try {
    // Log incoming request for debugging
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const { title, description, category, author } = req.body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Description is required'
      });
    }
    if (!category || category.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Category is required'
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'File is required'
      });
    }

    // Validate category
    const allowedCategories = ['books', 'audio', 'video', 'documents'];
    if (!allowedCategories.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid category. Allowed categories: ${allowedCategories.join(', ')}`
      });
    }

    // Derive fileUrl, fileType, and fileSize from uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const fileType = fileExtension.replace('.', '');
    const fileSize = (req.file.size / 1024 / 1024).toFixed(2) + ' MB';

    // Validate fileType
    const allowedFileTypes = ['pdf', 'doc', 'docx', 'mp3', 'mp4', 'avi', 'mov'];
    if (!allowedFileTypes.includes(fileType)) {
      // Remove uploaded file if validation fails
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error removing invalid file:', unlinkError);
      }
      return res.status(400).json({
        success: false,
        error: `Invalid file type. Allowed types: ${allowedFileTypes.join(', ')}`
      });
    }

    const materialData = {
      title: title.trim(),
      description: description.trim(),
      category: category.toLowerCase(),
      author: author ? author.trim() : '',
      fileUrl,
      fileType,
      fileSize
    };

    console.log('Material data to save:', materialData);

    const material = await LibraryMaterial.create(materialData);
    
    res.status(201).json({
      success: true,
      data: normalize(material)
    });
  } catch (error) {
    console.error('Error in createLibraryMaterial:', error);
    
    // Remove uploaded file if database save fails
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error removing file after database error:', unlinkError);
      }
    }
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({
        success: false,
        error: message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while creating library material'
    });
  }
};

// @desc    Update library material
// @route   PUT /api/library/:id
// @access  Private/Admin
const updateLibraryMaterial = async (req, res) => {
  try {
    const material = await LibraryMaterial.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Library material not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: normalize(material)
    });
  } catch (error) {
    console.error('Error updating material:', error);
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({
        success: false,
        error: message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while updating library material'
    });
  }
};

// @desc    Delete library material (soft delete)
// @route   DELETE /api/library/:id
// @access  Private/Admin
const deleteLibraryMaterial = async (req, res) => {
  try {
    const material = await LibraryMaterial.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Library material not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Library material deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting library material'
    });
  }
};

module.exports = {
  getLibraryMaterials,
  getLibraryMaterial,
  downloadLibraryMaterial,
  createLibraryMaterial,
  updateLibraryMaterial,
  deleteLibraryMaterial
};

