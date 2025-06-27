import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import TableHead from "@mui/material/TableHead";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import { Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
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

const TeamMembersTable = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false); // New state for upload modal
  const [editData, setEditData] = useState({});
  const { userRole, userEmpId } = useAuth(); // Access user role, EmpId, and userName from context

  useEffect(() => {
    axios
      // .get("https://jsonserver-2xm2.onrender.com/employeesData")
      .get("https://teamservices-backend.onrender.com/employeesData")
      .then((response) => {
        setEmployeesData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [DeleteIcon]);

  // EDIT (update) details of Members
  const handleEdit = (employee) => {
    if (userRole === "viewer" && employee.EmpId !== userEmpId) {
      alert("You can only edit your own data.");
      return;
    }
    setEditData(employee);
    setEditModalOpen(true);
  };

  // DELETE Function to delete the user if ADMIN or MANAGER
  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    // Check if _id is valid
    if (!_id || _id.length !== 24) {
      alert("Invalid Employee ID. Deletion failed.");
      return;
    }

    try {
      const response = await axios.delete(
        `https://teamservicesbackend.up.railway.app/employeesData/${_id}`
      );

      if (response.status === 200) {
        // alert("Employee deleted successfully!");
        setEmployeesData((prevEmployees) =>
          prevEmployees.filter((emp) => emp._id !== _id)
        );
        toast.error("Employee Deleted", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light"
        });
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Please try again.");
    }
  };

  // console.log("Current User ID:", userEmpId);
  // console.log("Selected Employee ID:", employee.EmpId);

  // On saving the updated employees
  const handleSave = (updatedEmployee) => {
    if (!updatedEmployee._id) {
      alert("Invalid employee data. Missing _id.");
      return;
    }

    axios
      .put(
        `https://teamservicesbackend.up.railway.app/employeesData/${updatedEmployee._id}`,
        updatedEmployee
      )
      .then((response) => {
        console.log("Updated Employee Response:", response.data);

        setEmployeesData((prevData) =>
          prevData.map((emp) =>
            emp._id === updatedEmployee._id ? response.data : emp
          )
        );
        setEditModalOpen(false);
        toast.success("Updated Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light"
        });
      })
      .catch((error) => {
        console.error(
          "Error updating data:",
          error.response?.data || error.message
        );
        alert("Failed to update employee. Please try again.");
      });
  };

  //Close the Edit form after Updating
  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  // Open Form to ADD a Member
  const handleAdd = () => {
    setAddModalOpen(true);
  };

  // ADD the New Member manually
  const handleAddSave = async (employeeData) => {
    try {
      const response = await fetch("https://teamservicesbackend.up.railway.app/employeesData", {
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
      setEmployeesData((prev) => [...prev, newEmployee]); // Update frontend state
      handleAddClose(); // Close modal after successful save
      toast.success("Member Added Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Close Form to Add new Member
  const handleAddClose = () => {
    setAddModalOpen(false);
  };

  // Form to Upload Members from device(excel sheet)
  const handleUploadOpen = () => {
    setUploadModalOpen(true);
  };

  //Adding (uploading) New Member in Team Members by Uploading from Device
  const handleUploadSave = (newData) => {
    newData.forEach((employee) => {
      axios
        // .post("https://jsonserver-2xm2.onrender.com/employeesData", employee)
        .post("https://teamservicesbackend.up.railway.app/employeesData", employee)
        .then((response) => {
          setEmployeesData((prevData) => [...prevData, response.data]);
          toast.success("Members Uploaded Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
          });
        })
        .catch((error) => {
          console.error("Error adding data from upload: ", error);
          alert("Failed to upload employee data. Please try again.");
        });
    });
    setUploadModalOpen(false);
  };

  // Close form to add (upload) new members
  const handleUploadClose = () => {
    setUploadModalOpen(false);
  };

  // Search Function
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Download data in Excel sheet
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

  // Searching method implementation
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
    <>
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
                        marginRight: "8px", // Space between Add and Upload
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
                        marginRight: "8px", // Space between Upload and Download
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
                    <Box sx={{ display: "flex", justifyContent: "center", gap:"0.3rem" }}>
                      {/* EDIT BUTTON */}
                      <Tooltip title="Edit Employee List">
                        <IconButton
                          sx={{
                            color: "blue",
                            "&:hover": { color: "darkblue" },
                          }}
                          onClick={() => handleEdit(row)}
                          disabled={
                            userRole === "viewer" && row.EmpId !== userEmpId
                          }
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

        {/* Edit Modal */}
        {editModalOpen && (
          <EditModal
            open={editModalOpen}
            handleClose={handleCloseModal}
            employee={editData}
            handleSave={handleSave}
          />
        )}
        {/* add modal */}
        <AddModal
          open={addModalOpen}
          handleClose={handleAddClose}
          handleSave={handleAddSave}
        />

        {/* Upload Modal */}
        <UploadModal
          open={uploadModalOpen}
          handleClose={handleUploadClose}
          handleSave={handleUploadSave}
        />
      </Box>
    </>
  );
};

export default TeamMembersTable;
