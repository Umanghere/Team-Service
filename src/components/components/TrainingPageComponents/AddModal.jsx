import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import PropTypes from "prop-types";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 700,
  maxHeight: "90%",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const AddModal = ({ open, handleClose, handleSave }) => {
  const [newEmployee, setNewEmployee] = useState({
    Nominate: "",
    TrainingTitle: "",
    TrainingType: "",
    Mode: "",
    PlannedDate: null,
    StartDate: null,
    EndDate: null,
    Status: "",
    Reference: "",
  });

  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission

  const requiredFields = [
    "Nominate",
    "TrainingTitle",
    "TrainingType",
    "Mode",
    "PlannedDate",
    "StartDate",
    "EndDate",
    "Status"
  ];

  useEffect(() => {
    let isMounted = true;
  
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/employeesData`);
        if (isMounted) {
          setEmployees(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      }
    };
  
    if (open) {
      fetchEmployees();
    }
    
    return () => {
      isMounted = false;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setNewEmployee({
        Nominate: "",
        TrainingTitle: "",
        TrainingType: "",
        Mode: "",
        PlannedDate: null,
        StartDate: null,
        EndDate: null,
        Status: "",
        Reference: "",
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: requiredFields.includes(name) && !value.trim() 
        ? `${name} is required` 
        : "",
    }));
  };

  const handleDateChange = (name, value) => {
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: requiredFields.includes(name) && !value 
        ? `${name} is required` 
        : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    requiredFields.forEach(field => {
      const value = newEmployee[field];
      if (!value || (typeof value === 'string' && !value.trim())) {
        newErrors[field] = `${field} is required`;
      }
    });
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) return;
  
    setIsSubmitting(true); // Disable the button
  
    const dataToSave = {
      ...newEmployee,
      Name: newEmployee.Nominate,
    };
  
    try {
      await handleSave(dataToSave); // Call the async save function
      // Reset form after successful save
      setNewEmployee({
        Nominate: "",
        TrainingTitle: "",
        TrainingType: "",
        Mode: "",
        PlannedDate: null,
        StartDate: null,
        EndDate: null,
        Status: "",
        Reference: "",
      });
      setErrors({});
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button regardless of the outcome
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-training-modal"
      aria-describedby="add-training-modal-description"
    >
      <Box sx={style}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography 
              id="add-training-modal" 
              variant="h5" 
              component="h2" 
              sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}
            >
              ADD TRAINING DATA
            </Typography>
            
            <Grid container spacing={3}>
              {/* Row 1: Nominate and Training Title */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  margin="dense"
                  required
                  error={!!errors.Nominate}
                  size="medium"
                >
                  <InputLabel id="nominate-label">Nominate</InputLabel>
                  <Select
                    labelId="nominate-label"
                    name="Nominate"
                    value={newEmployee.Nominate}
                    onChange={handleChange}
                    label="Nominate"
                  >
                    {employees.map((emp) => (
                      <MenuItem
                        key={emp.EmpId}
                        value={`${emp.Name}(${emp.EmpId})`}
                      >
                        {`${emp.Name} (${emp.EmpId})`}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.Nominate && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.Nominate}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Training Titles (comma separated)"
                  name="TrainingTitle"
                  value={newEmployee.TrainingTitle}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  required
                  size="medium"
                  error={!!errors.TrainingTitle}
                  helperText={errors.TrainingTitle || "Enter multiple titles separated by commas"}
                />
              </Grid>

              {/* Row 2: Training Type and Mode */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  margin="dense"
                  required
                  error={!!errors.TrainingType}
                  size="medium"
                >
                  <InputLabel id="training-type-label">Training Type</InputLabel>
                  <Select
                    labelId="training-type-label"
                    name="TrainingType"
                    value={newEmployee.TrainingType}
                    onChange={handleChange}
                    label="Training Type"
                  >
                    <MenuItem value="Self">Self</MenuItem>
                    <MenuItem value="Corporate">Corporate</MenuItem>
                  </Select>
                  {errors.TrainingType && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.TrainingType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  margin="dense"
                  required
                  error={!!errors.Mode}
                  size="medium"
                >
                  <InputLabel id="mode-label">Mode</InputLabel>
                  <Select
                    labelId="mode-label"
                    name="Mode"
                    value={newEmployee.Mode}
                    onChange={handleChange}
                    label="Mode"
                  >
                    <MenuItem value="Online">Online</MenuItem>
                    <MenuItem value="Offline">Offline</MenuItem>
                  </Select>
                  {errors.Mode && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.Mode}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Row 3: Planned Date and Status */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Planned Date *"
                  value={newEmployee.PlannedDate}
                  onChange={(value) => handleDateChange("PlannedDate", value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "dense",
                      size: "medium",
                      error: !!errors.PlannedDate,
                      helperText: errors.PlannedDate,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  margin="dense"
                  required
                  error={!!errors.Status}
                  size="medium"
                >
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="Status"
                    value={newEmployee.Status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                  {errors.Status && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.Status}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Row 4: Start Date and End Date */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date *"
                  value={newEmployee.StartDate}
                  onChange={(value) => handleDateChange("StartDate", value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "dense",
                      size: "medium",
                      error: !!errors.StartDate,
                      helperText: errors.StartDate,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date *"
                  value={newEmployee.EndDate}
                  onChange={(value) => handleDateChange("EndDate", value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "dense", 
                      size: "medium",
                      error: !!errors.EndDate,
                      helperText: errors.EndDate,
                    }
                  }}
                />
              </Grid>

              {/* Row 5: Reference (Full Width, Optional) */}
              <Grid item xs={12}>
                <TextField
                  label="Reference (Optional)"
                  name="Reference"
                  value={newEmployee.Reference}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  size="medium"
                  multiline
                  rows={2}
                  helperText="Optional: Add any reference links, notes, or additional information"
                  placeholder="Enter reference URL, notes, or additional details..."
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
                borderTop: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Button 
                onClick={handleClose}
                variant="outlined" 
                color="secondary"
                size="large"
                sx={{ minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button 
                disabled={Object.values(errors).some((error) => error) || isSubmitting} // Disable when errors exist or submitting
                type="submit" 
                variant="contained" 
                color="primary"
                size="large"
                sx={{ minWidth: 100 }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
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