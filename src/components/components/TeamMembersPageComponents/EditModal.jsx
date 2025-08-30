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

const EditModal = ({ open, handleClose, handleSave, employee }) => {
  const [editEmployee, setEditEmployee] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setEditEmployee({ ...employee });
      setIsSubmitting(false);
    }
  }, [employee, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleSave(editEmployee);
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="edit-employee-modal">
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography
          id="edit-employee-modal"
          variant="h5"
          component="h2"
          sx={{ mb: 3, fontWeight: 600, color: "primary.main" }}
        >
          Edit Employee
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="Name"
              value={editEmployee?.Name || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Grade"
              name="Grade"
              value={editEmployee?.Grade || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Designation"
              name="Designation"
              value={editEmployee?.Designation || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Project"
              name="Project"
              value={editEmployee?.Project || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Skills"
              name="Skills"
              value={editEmployee?.Skills || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              name="Location"
              value={editEmployee?.Location || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Number"
              name="ContactNo"
              value={editEmployee?.ContactNo || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
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
            sx={{ minWidth: 100 }}
            disabled={isSubmitting}
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

EditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  employee: PropTypes.object,
};

export default EditModal;