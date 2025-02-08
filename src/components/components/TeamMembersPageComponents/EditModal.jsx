import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', 
  maxWidth: 600, 
  maxHeight: '90%', 
  overflow: 'hidden', 
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const EditModal = ({ open, handleClose, handleSave, employee }) => {
  const [editEmployee, setEditEmployee] = useState({});

  // Ensure form is updated when employee changes
  useEffect(() => {
    if (employee) {
      setEditEmployee({ ...employee });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(editEmployee);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="edit-employee-modal">
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="edit-employee-modal" variant="h6">Edit Employee</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="Name"
              value={editEmployee?.Name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Grade"
              name="Grade"
              value={editEmployee?.Grade || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Designation"
              name="Designation"
              value={editEmployee?.Designation || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Project"
              name="Project"
              value={editEmployee?.Project || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Skills"
              name="Skills"
              value={editEmployee?.Skills || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              name="Location"
              value={editEmployee?.Location || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Number"
              name="ContactNo"
              value={editEmployee?.ContactNo || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'right' }}>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

EditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  employee: PropTypes.object,
};

export default EditModal;
