import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  TableHead,
  Tooltip,
  Typography,
  Chip,
  Avatar,
  Card,
  CardContent,
  Fade,
  Zoom,
  Skeleton,
  Alert,
  Snackbar,
  Button,
  Stack,
  Divider,
  useMediaQuery
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Code as CodeIcon,
  Badge as BadgeIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import UploadModal from "./UploadModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "../../../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.spacing(3),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  "&:hover": {
    transform: 'translateY(-1px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  },
  "&:focus-within": {
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.3)',
    transform: 'translateY(-1px)',
  },
  width: "100%",
  maxWidth: 400,
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
  zIndex: 1,
}));

const StyledInputBase = styled("input")(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5, 1.5, 1.5, 6),
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontSize: '16px',
  color: theme.palette.text.primary,
  '&::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 0.7,
  },
}));

const ActionButton = styled(IconButton)(({ theme, variant = 'primary' }) => {
  const colors = {
    primary: { bg: '#667eea', hover: '#5a6fd8' },
    success: { bg: '#48bb78', hover: '#38a169' },
    error: { bg: '#f56565', hover: '#e53e3e' },
    warning: { bg: '#ed8936', hover: '#dd7724' },
  };
  
  return {
    background: `linear-gradient(135deg, ${colors[variant].bg} 0%, ${colors[variant].hover} 100%)`,
    color: 'white',
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(1.2),
    margin: theme.spacing(0, 0.5),
    boxShadow: `0 4px 15px ${alpha(colors[variant].bg, 0.3)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: `linear-gradient(135deg, ${colors[variant].hover} 0%, ${colors[variant].bg} 100%)`,
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 25px ${alpha(colors[variant].bg, 0.4)}`,
    },
    '&:active': {
      transform: 'translateY(0px)',
    },
    '&:disabled': {
      opacity: 0.6,
      transform: 'none',
      cursor: 'not-allowed',
    },
  };
});

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '& .MuiTableCell-head': {
    color: 'white',
    fontWeight: 700,
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: theme.spacing(2),
    borderBottom: 'none',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    transform: 'scale(1.01)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  '&:nth-of-type(even)': {
    backgroundColor: alpha(theme.palette.grey[100], 0.5),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  fontSize: '0.9rem',
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const statusColors = {
    'Active': { bg: '#48bb78', color: 'white' },
    'Inactive': { bg: '#f56565', color: 'white' },
    'On Leave': { bg: '#ed8936', color: 'white' },
  };
  
  return {
    backgroundColor: statusColors[status]?.bg || theme.palette.grey[300],
    color: statusColors[status]?.color || theme.palette.text.primary,
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 24,
    borderRadius: 12,
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  };
});

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <ActionButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        variant="primary"
        size="small"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </ActionButton>
      <ActionButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        variant="primary"
        size="small"
      >
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </ActionButton>
      <ActionButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        variant="primary"
        size="small"
      >
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </ActionButton>
      <ActionButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        variant="primary"
        size="small"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </ActionButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const TeamMembersTable = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userRole, userEmpId } = useAuth();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://teamservices-backend.onrender.com/employeesData");
        setEmployeesData(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("Failed to load employee data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (employee) => {
    if (userRole === "viewer" && employee.EmpId !== userEmpId) {
      toast.warning("You can only edit your own data.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setEditData(employee);
    setEditModalOpen(true);
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    if (!_id || _id.length !== 24) {
      toast.error("Invalid Employee ID. Deletion failed.");
      return;
    }

    try {
      const response = await axios.delete(
        `https://teamservices-backend.onrender.com/employeesData/${_id}`
      );

      if (response.status === 200) {
        setEmployeesData((prevEmployees) =>
          prevEmployees.filter((emp) => emp._id !== _id)
        );
        toast.success("Employee deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee. Please try again.");
    }
  };

  const handleSave = (updatedEmployee) => {
    if (!updatedEmployee._id) {
      toast.error("Invalid employee data. Missing ID.");
      return;
    }

    axios
      .put(
        `https://teamservices-backend.onrender.com/employeesData/${updatedEmployee._id}`,
        updatedEmployee
      )
      .then((response) => {
        setEmployeesData((prevData) =>
          prevData.map((emp) =>
            emp._id === updatedEmployee._id ? response.data : emp
          )
        );
        setEditModalOpen(false);
        toast.success("Employee updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("Error updating data:", error.response?.data || error.message);
        toast.error("Failed to update employee. Please try again.");
      });
  };

  const handleAddSave = async (employeeData) => {
    try {
      const response = await fetch("https://teamservices-backend.onrender.com/employeesData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      const newEmployee = await response.json();
      setEmployeesData((prev) => [...prev, newEmployee]);
      setAddModalOpen(false);
      toast.success("Employee added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee. Please try again.");
    }
  };

  const handleUploadSave = (newData) => {
    const promises = newData.map((employee) =>
      axios.post("https://teamservices-backend.onrender.com/employeesData", employee)
    );

    Promise.all(promises)
      .then((responses) => {
        const newEmployees = responses.map(response => response.data);
        setEmployeesData((prevData) => [...prevData, ...newEmployees]);
        toast.success(`${newData.length} employees uploaded successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("Error uploading data: ", error);
        toast.error("Some employees failed to upload. Please try again.");
      });
    
    setUploadModalOpen(false);
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(employeesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, `employees_data_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Employee data downloaded successfully!");
  };

  const filteredData = employeesData.filter((row) =>
    Object.values(row).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - filteredData.length);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 2 }} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Fade in timeout={1000}>
      <Box sx={{ p: { xs: 2, md: 4 }, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        {/* Header Card */}
        <StyledCard>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Team Members
                </Typography>
                <Typography variant="body1" opacity={0.9}>
                  Manage your team efficiently with our advanced member management system
                </Typography>
              </Box>
              
              <SearchContainer>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchContainer>
            </Stack>
          </CardContent>
        </StyledCard>

        {/* Action Buttons */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
              {userRole === "admin" && (
                <>
                  <Tooltip title="Add New Employee" arrow>
                    <ActionButton onClick={() => setAddModalOpen(true)} variant="primary">
                      <AddIcon />
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Upload Employee List" arrow>
                    <ActionButton onClick={() => setUploadModalOpen(true)} variant="warning">
                      <UploadIcon />
                    </ActionButton>
                  </Tooltip>
                </>
              )}
              <Tooltip title="Download Employee Data" arrow>
                <ActionButton onClick={handleDownload} variant="success">
                  <DownloadIcon />
                </ActionButton>
              </Tooltip>
            </Stack>
          </CardContent>
        </Card>

        {/* Table */}
        <StyledTableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <StyledTableHead>
              <TableRow>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <BadgeIcon fontSize="small" />
                    Employee ID
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <PersonIcon fontSize="small" />
                    Name
                  </Box>
                </TableCell>
                <TableCell align="center">Grade</TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <BusinessIcon fontSize="small" />
                    Designation
                  </Box>
                </TableCell>
                <TableCell align="center">Project</TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <CodeIcon fontSize="small" />
                    Skills
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <LocationIcon fontSize="small" />
                    Location
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <PhoneIcon fontSize="small" />
                    Contact
                  </Box>
                </TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              <AnimatePresence>
                {(rowsPerPage > 0
                  ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredData
                ).map((row, index) => (
                  <motion.tr
                    key={row.EmpId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    component={StyledTableRow}
                  >
                    <StyledTableCell align="center">
                      <Chip
                        label={row.EmpId}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: theme.palette.primary.main,
                            fontSize: '0.875rem',
                          }}
                        >
                          {row.Name?.charAt(0) || 'N'}
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>
                          {row.Name}
                        </Typography>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <StatusChip
                        label={row.Grade}
                        size="small"
                        status="Active"
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.Designation}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Chip
                        label={row.Project}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body2" sx={{ maxWidth: 150, wordWrap: 'break-word' }}>
                        {row.Skills}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.Location}</StyledTableCell>
                    <StyledTableCell align="center">{row.ContactNo}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Edit Employee" arrow>
                          <span>
                            <ActionButton
                              onClick={() => handleEdit(row)}
                              disabled={userRole === "viewer" && row.EmpId !== userEmpId}
                              variant="primary"
                              size="small"
                            >
                              <EditIcon fontSize="small" />
                            </ActionButton>
                          </span>
                        </Tooltip>
                        {userRole !== "viewer" && (
                          <Tooltip title="Delete Employee" arrow>
                            <ActionButton
                              onClick={() => handleDelete(row._id)}
                              variant="error"
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </ActionButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </StyledTableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={9} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={9}
                  count={filteredData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  sx={{
                    '& .MuiTablePagination-toolbar': {
                      paddingLeft: 2,
                      paddingRight: 2,
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      fontWeight: 500,
                    },
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </StyledTableContainer>

        {/* Modals */}
        {editModalOpen && (
          <EditModal
            open={editModalOpen}
            handleClose={() => setEditModalOpen(false)}
            employee={editData}
            handleSave={handleSave}
          />
        )}
        
        <AddModal
          open={addModalOpen}
          handleClose={() => setAddModalOpen(false)}
          handleSave={handleAddSave}
        />

        <UploadModal
          open={uploadModalOpen}
          handleClose={() => setUploadModalOpen(false)}
          handleSave={handleUploadSave}
        />
      </Box>
    </Fade>
  );
};

export default TeamMembersTable;