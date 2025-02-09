import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const UploadModal = ({ open, handleClose, handleSave }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      setFile(null);
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

  const handleFileUpload = () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames.length) {
          throw new Error('No sheets found in the file.');
        }

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' }); // Avoid undefined values

        if (!jsonData.length) {
          throw new Error('The uploaded file is empty or has no readable data.');
        }

        console.log('Extracted Data:', jsonData); // Debugging

        // Try saving the data
        try {
          handleSave(jsonData);
          handleClose();
        } catch (saveError) {
          console.error('Error saving data:', saveError);
          setError('Failed to upload employee data. Please try again.');
        }

      } catch (err) {
        console.error('File processing error:', err);
        setError('Error processing file. Please check the format or try a different file.');
      }
    };

    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="upload-modal-title">
      <Box sx={style}>
        <Typography id="upload-modal-title" variant="h6">
          Upload Employee Data
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'right', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleFileUpload}>
            Upload
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
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
