import React, { useState, useEffect } from "react";
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
  AppBar,
  Toolbar,
  InputBase,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import UploadModal from "./UploadModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "../../../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';

// Styled components for search input
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[200],
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.primary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

// Table Pagination component
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
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

// Main Component
const TeamMembersTable = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const { userRole, userEmpId } = useAuth();

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employeesData`
      );
      setEmployeesData(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast.error("Failed to fetch employee data.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    if (userRole === "viewer" && employee.EmpId !== userEmpId) {
      toast.error("You can only edit your own data.");
      return;
    }
    setEditData(employee);
    setEditModalOpen(true);
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/employeesData/${_id}`
      );
      setEmployeesData((prevEmployees) =>
        prevEmployees.filter((emp) => emp._id !== _id)
      );
      toast.error("Employee Deleted Successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee. Please try again.");
    }
  };

  const handleSave = async (updatedEmployee) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/employeesData/${updatedEmployee._id}`,
        updatedEmployee
      );

      setEmployeesData((prevData) =>
        prevData.map((emp) =>
          emp._id === updatedEmployee._id ? response.data : emp
        )
      );
      setEditModalOpen(false);
      toast.success("Updated Successfully");
    } catch (error) {
      console.error("Error updating data:", error.response?.data || error.message);
      toast.error("Failed to update employee. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleAddSave = async (employeeData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/employeesData`,
        employeeData
      );

      setEmployeesData((prev) => [...prev, response.data]);
      handleAddClose();
      toast.success("Member Added Successfully");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee. Please try again.");
    }
  };

  const handleAddClose = () => {
    setAddModalOpen(false);
  };

  const handleUploadOpen = () => {
    setUploadModalOpen(true);
  };

  const handleUploadSave = async (newData) => {
    try {
      // Use Promise.all to handle concurrent API calls more efficiently
      const uploadPromises = newData.map((employee) =>
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/employeesData`, employee)
      );
      const responses = await Promise.all(uploadPromises);

      // Extract new employee data from responses
      const newEmployees = responses.map(res => res.data);
      setEmployeesData(prevData => [...prevData, ...newEmployees]);
      toast.success("Members Uploaded Successfully");
    } catch (error) {
      console.error("Error adding data from upload: ", error);
      toast.error("Failed to upload employee data. Please try again.");
    } finally {
      setUploadModalOpen(false);
    }
  };

  const handleUploadClose = () => {
    setUploadModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
    saveAs(file, "employees_data.xlsx");
  };

  const filteredData = employeesData.filter(
    (row) =>
      (row.Name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (row.Grade?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (row.Designation?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (row.Project?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (row.Skills?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (row.Location?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (row.ContactNo?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - filteredData.length);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ paddingRight: 10, paddingLeft: 10 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "var(--lt-color-gray-400)" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="inherit"
              noWrap
              sx={{ color: "black", display: { xs: "none", sm: "block" } }}
            >
              Employee
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{
                  "aria-label": "search",
                  style: { color: "black" },
                }}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Search>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {userRole === "admin" && (
              <>
                <Tooltip title="Add Employee">
                  <IconButton
                    onClick={handleAdd}
                    sx={{
                      backgroundColor: "blue",
                      color: "white",
                      "&:hover": { backgroundColor: "darkblue" },
                      marginRight: "8px",
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Upload Employee List">
                  <IconButton
                    onClick={handleUploadOpen}
                    sx={{
                      backgroundColor: "red",
                      color: "white",
                      "&:hover": { backgroundColor: "darkred" },
                      marginRight: "8px",
                    }}
                  >
                    <UploadIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {(userRole === "admin" ||
              userRole === "manager" ||
              userRole === "viewer") && (
              <Tooltip title="Download Employee List">
                <IconButton
                  onClick={handleDownload}
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    "&:hover": { backgroundColor: "darkgreen" },
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                EmpID
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Grade
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Designation
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Project
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Skills
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Location
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                ContactNo
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredData
            ).map((row) => (
              <TableRow key={row.EmpId}>
                <TableCell align="center" component="th" scope="row">
                  {row.EmpId}
                </TableCell>
                <TableCell align="center">{row.Name}</TableCell>
                <TableCell align="center">{row.Grade}</TableCell>
                <TableCell align="center">{row.Designation}</TableCell>
                <TableCell align="center">{row.Project}</TableCell>
                <TableCell align="center">{row.Skills}</TableCell>
                <TableCell align="center">{row.Location}</TableCell>
                <TableCell align="center">{row.ContactNo}</TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: "0.3rem" }}
                  >
                    {/* EDIT BUTTON */}
                    <Tooltip title="Edit Employee List">
                      <IconButton
                        sx={{
                          color: "blue",
                          "&:hover": { color: "darkblue" },
                        }}
                        onClick={() => handleEdit(row)}
                        disabled={userRole === "viewer" && row.EmpId !== userEmpId}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    {/* DELETE BUTTON - Hidden for Viewers */}
                    {userRole !== "viewer" && (
                      <Tooltip title="Delete Employee">
                        <IconButton
                          sx={{
                            color: "red",
                            "&:hover": { color: "darkred" },
                          }}
                          onClick={() => handleDelete(row._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
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
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Modals */}
      {editModalOpen && (
        <EditModal
          open={editModalOpen}
          handleClose={handleCloseModal}
          employee={editData}
          handleSave={handleSave}
        />
      )}
      <AddModal
        open={addModalOpen}
        handleClose={handleAddClose}
        handleSave={handleAddSave}
      />
      <UploadModal
        open={uploadModalOpen}
        handleClose={handleUploadClose}
        handleSave={handleUploadSave}
      />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
};

export default TeamMembersTable;