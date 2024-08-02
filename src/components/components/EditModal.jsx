import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import PropTypes from 'prop-types';

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

const EditModal = ({ open, handleClose, employee, handleSave }) => {
  const [editEmployee, setEditEmployee] = useState({ ...employee });
//set the edited data
  useEffect(() => {
    setEditEmployee({ ...employee });
  }, [employee]);
//set the editr=ed data in api
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
//handles the submit click
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(editEmployee);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-employee-modal"
      aria-describedby="edit-employee-modal-description"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="edit-employee-modal" variant="h6" component="h2">
          Edit Employee
        </Typography>
        <TextField
          label="Name"
          name="Name"
          value={editEmployee.Name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Grade"
          name="Grade"
          value={editEmployee.Grade}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Designation"
          name="Designation"
          value={editEmployee.Designation}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Project"
          name="Project"
          value={editEmployee.Project}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Skills"
          name="Skills"
          value={editEmployee.Skills}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Location"
          name="Location"
          value={editEmployee.Location}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="ContactNo"
          name="ContactNo"
          value={editEmployee.ContactNo}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
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
  employee: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default EditModal;
