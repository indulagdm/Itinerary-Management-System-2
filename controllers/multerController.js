export const uploadSingleFile = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        path: fileUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadMultipleFiles = (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    const files = req.files.map((f) => ({
      originalName: f.originalname,
      fileName: f.filename,
      path: `/uploads/${f.filename}`,
    }));

    res.status(200).json({
      message: "Files uploaded successfully",
      files,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
