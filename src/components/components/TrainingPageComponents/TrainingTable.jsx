import React, { useState, useEffect, useCallback } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import { Tooltip, InputBase, AppBar, Toolbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { styled } from "@mui/material/styles";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    "&::placeholder": {
      color: "black",
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

export default function TrainingTable() {
  const [trainingData, setTrainingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const { userRole, userEmpId, userName } = useAuth();

  const fetchTrainingData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/trainingData`
      );
      setTrainingData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch training data.");
    }
  }, []);

  useEffect(() => {
    fetchTrainingData();
  }, [fetchTrainingData]);

  const handleEdit = (employeeData) => {
    setEditData(employeeData);
    setEditModalOpen(true);
  };

  const handleSave = async (updatedEmployee) => {
    try {
      if (!updatedEmployee || !updatedEmployee._id) {
        throw new Error("Updated employee data is missing ID.");
      }
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/trainingData/${updatedEmployee._id}`,
        updatedEmployee
      );
      setTrainingData((prevData) =>
        prevData.map((emp) =>
          emp._id === updatedEmployee._id ? response.data : emp
        )
      );
      handleCloseModal();
      toast.success("Updated Successfully");
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update employee. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleAddSave = async (newEmployee) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/trainingData`,
        newEmployee
      );
      setTrainingData((prevData) => [...prevData, response.data]);
      handleAddClose();
      toast.success("Training Added Successfully");
    } catch (error) {
      console.error("Error adding training data:", error);
      toast.error("Failed to add training data. Please try again.");
    }
  };

  const handleAddClose = () => {
    setAddModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(trainingData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Training Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "training_data.xlsx");
    toast.info("Downloading training data...");
  };

  const handleCopy = (row) => {
    const rowData = `
      Name: ${row.Name}
      Training Titles: ${row.TrainingTitle.split(",").join(", ")}
      Training Type: ${row.TrainingType}
      Mode: ${row.Mode}
      Planned Date: ${new Date(row.PlannedDate).toLocaleDateString()}
      Start Date: ${new Date(row.StartDate).toLocaleDateString()}
      End Date: ${new Date(row.EndDate).toLocaleDateString()}
      Status: ${row.Status}
    `;
    navigator.clipboard.writeText(rowData).then(() => {
      toast.info(`Details of ${row.Name} copied to clipboard.`);
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const filteredData = trainingData.filter(
    (row) =>
      (row.Name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.TrainingTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.TrainingType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.Mode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (formatDate(row.PlannedDate) || "").includes(searchTerm.toLowerCase()) ||
      (formatDate(row.StartDate) || "").includes(searchTerm.toLowerCase()) ||
      (formatDate(row.EndDate) || "").includes(searchTerm.toLowerCase()) ||
      (row.Status || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {(userRole === "admin" || userRole === "manager") && (
                <Tooltip title="Add Training">
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
              )}
              <Tooltip title="Download Training Data">
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
            </Box>
          </Toolbar>
        </AppBar>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Training Title
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Training Type
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Mode
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Planned Date
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Start Date
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  End Date
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Status
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
                <TableRow key={row.id}>
                  <TableCell align="center">{row.Name}</TableCell>
                  <TableCell align="center">
                    {row.TrainingTitle.split(",").map((title, index) => (
                      <div key={index}>{title.trim()}</div>
                    ))}
                  </TableCell>
                  <TableCell align="center">{row.TrainingType}</TableCell>
                  <TableCell align="center">{row.Mode}</TableCell>
                  <TableCell align="center">
                    {formatDate(row.PlannedDate)}
                  </TableCell>
                  <TableCell align="center">
                    {formatDate(row.StartDate)}
                  </TableCell>
                  <TableCell align="center">
                    {formatDate(row.EndDate)}
                  </TableCell>
                  <TableCell align="center">{row.Status}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Tooltip title="Edit Training Data">
                        <IconButton
                          sx={{
                            color: "blue",
                            "&:hover": { color: "darkblue" },
                          }}
                          onClick={() => handleEdit(row)}
                          disabled={
                            userRole === "viewer" && !row.Name.includes(userName)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copy Training Details">
                        <IconButton
                          sx={{
                            color: "green",
                            "&:hover": { color: "darkgreen" },
                          }}
                          onClick={() => handleCopy(row)}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
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
      </Box>
      {editModalOpen && (
        <EditModal
          open={editModalOpen}
          handleClose={handleCloseModal}
          employeeData={editData}
          handleSave={handleSave}
        />
      )}
      <AddModal
        open={addModalOpen}
        handleClose={handleAddClose}
        handleSave={handleAddSave}
      />
    </>
  );
}

TrainingTable.propTypes = {
  // Add prop types here if TrainingTable were a child component
};