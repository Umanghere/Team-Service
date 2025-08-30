import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, Grid } from "@mui/material";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  maxHeight: "90%",
  overflow: "hidden",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AddModal = ({ open, handleClose, handleSave }) => {
  const [newEmployee, setNewEmployee] = useState({
    EmpId: "",
    Name: "",
    Grade: "",
    Designation: "",
    Project: "",
    Skills: "",
    Location: "",
    ContactNo: "",
  });

  const [errors, setErrors] = useState({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const allFieldsFilled = Object.values(newEmployee).every(
      (value) => value.trim() !== ""
    );
    setIsSaveDisabled(!allFieldsFilled);
  }, [newEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !value ? `${name} is required` : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(newEmployee).forEach((key) => {
      if (!newEmployee[key].trim()) {
        newErrors[key] = `${key} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSaveDisabled(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await handleSave(newEmployee);
      setNewEmployee({
        EmpId: "",
        Name: "",
        Grade: "",
        Designation: "",
        Project: "",
        Skills: "",
        Location: "",
        ContactNo: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-employee-modal"
      aria-describedby="add-employee-modal-description"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography
          id="add-employee-modal"
          variant="h5"
          component="h2"
          sx={{ mb: 3, fontWeight: 600, color: "primary.main" }}
        >
          Add Employee
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="EmpId"
              name="EmpId"
              value={newEmployee.EmpId}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              error={!!errors.EmpId}
              helperText={errors.EmpId}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="Name"
              value={newEmployee.Name}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              error={!!errors.Name}
              helperText={errors.Name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Grade"
              name="Grade"
              value={newEmployee.Grade}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              error={!!errors.Grade}
              helperText={errors.Grade}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Designation"
              name="Designation"
              value={newEmployee.Designation}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              error={!!errors.Designation}
              helperText={errors.Designation}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Project"
              name="Project"
              value={newEmployee.Project}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              error={!!errors.Project}
              helperText={errors.Project}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Skills"
              name="Skills"
              value={newEmployee.Skills}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              error={!!errors.Skills}
              helperText={errors.Skills}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              name="Location"
              value={newEmployee.Location}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              error={!!errors.Location}
              helperText={errors.Location}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ContactNo"
              name="ContactNo"
              value={newEmployee.ContactNo}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              error={!!errors.ContactNo}
              helperText={errors.ContactNo}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSaveDisabled || isSubmitting}
            sx={{ minWidth: 100 }}
          >
            Save
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="secondary"
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

AddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default AddModal;