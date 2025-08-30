import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  maxHeight: "90%",
  overflow: 'hidden',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const UploadModal = ({ open, handleClose, handleSave }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setError('');
      setFile(null);
      setIsUploading(false);
    }
  }, [open]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (fileType !== 'xlsx' && fileType !== 'xls') {
        setError('Invalid file type. Please upload an Excel file.');
        setFile(null);
      } else {
        setError('');
        setFile(selectedFile);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames.length) {
          throw new Error('No sheets found in the file.');
        }

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

        if (!jsonData.length) {
          throw new Error('The uploaded file is empty or has no readable data.');
        }

        try {
          await handleSave(jsonData);
          handleClose();
        } catch (saveError) {
          console.error('Error saving data:', saveError);
          setError('Failed to upload employee data. Please try again.');
        }

      } catch (err) {
        console.error('File processing error:', err);
        setError('Error processing file. Please check the format or try a different file.');
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      setIsUploading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="upload-modal-title">
      <Box sx={style}>
        <Typography id="upload-modal-title" variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
          Upload Employee Data
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFileUpload}
            disabled={!file || isUploading}
            size="large"
            sx={{ minWidth: 100 }}
          >
            Upload
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            size="large"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

UploadModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default UploadModal;