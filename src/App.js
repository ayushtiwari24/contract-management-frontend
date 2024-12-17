import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { io } from "socket.io-client";
import ContractTable from "./components/ContractTable";
import { getContracts, deleteContract } from "./services/api";

const App = () => {
  const [contracts, setContracts] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    client_name: "",
    limit: 10,
    offset: 0,
  });
  const [editingContract, setEditingContract] = useState(null);
  const [notification, setNotification] = useState("");
  const [fileData, setFileData] = useState(null);
  const fileInputRef = useRef(null);

  // Backend API URL for Socket.IO and fetch calls
  const BACKEND_URL =
    process.env.REACT_APP_API_URL ||
    "https://contract-management-backend.onrender.com"; // Use localhost for local testing

  // Fetch contracts initially and whenever filters change
  useEffect(() => {
    fetchContracts();

    // Initialize Socket.IO connection
    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      path: "/socket.io", // Ensure correct path
      reconnection: true,
    });

    // Socket.IO event handlers
    socket.on("connect", () => console.log("Socket connected successfully."));
    socket.on("contract_created", () => {
      setNotification("New Contract Added!");
      fetchContracts();
    });
    socket.on("contract_updated", () => {
      setNotification("Contract Updated!");
      fetchContracts();
    });
    socket.on("contract_deleted", () => {
      setNotification("Contract Deleted!");
      fetchContracts();
    });
    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    // Cleanup on unmount
    return () => socket.disconnect();
  }, [filters]);

  // Fetch contracts from the backend
  const fetchContracts = async () => {
    try {
      const response = await getContracts(filters); // Uses correct API
      setContracts(response.data.contracts || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setNotification("Failed to fetch contracts. Please try again later.");
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        setFileData(jsonData);
      } catch (err) {
        alert("Invalid JSON format.");
      }
    };
    reader.readAsText(file);
  };

  // Submit uploaded file to the backend
  const handleSubmitFile = async () => {
    if (!fileData) return;

    try {
      for (const contract of fileData) {
        const response = await fetch(`${BACKEND_URL}/api/contracts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contract),
        });

        if (response.status === 409) {
          alert(`Duplicate contract skipped: ${contract.client_name}`);
          continue;
        }

        if (!response.ok) {
          throw new Error(`Failed to upload contract: ${contract.client_name}`);
        }
      }

      alert("Contracts uploaded successfully!");
      setFileData(null);
      fetchContracts();

      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("An error occurred while uploading contracts.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContract(id);
      alert("Contract deleted successfully!");
      fetchContracts();
    } catch (error) {
      console.error("Error deleting contract:", error);
      alert("Failed to delete the contract.");
    }
  };

  const handleEdit = (contract) => {
    setEditingContract(contract);
  };

  const handleUpdateContract = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/contracts/${editingContract.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingContract),
        }
      );

      if (!response.ok) throw new Error("Failed to update contract.");

      alert("Contract updated successfully!");
      setEditingContract(null);
      fetchContracts();
    } catch (err) {
      console.error("Error updating contract:", err);
      alert("Failed to update the contract.");
    }
  };

  return (
    <div>
      <h1>Contract Management</h1>
      {notification && <div className="notification">{notification}</div>}

      {/* File Upload Section */}
      <div>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          ref={fileInputRef}
        />
        <button className="filter" onClick={handleSubmitFile}>
          Upload Contracts
        </button>
      </div>

      {/* Edit Form */}
      {editingContract && (
        <form onSubmit={handleUpdateContract} style={{ margin: "20px 0" }}>
          <h3>Edit Contract</h3>
          <label>Client Name: </label>
          <input
            value={editingContract.client_name}
            onChange={(e) =>
              setEditingContract({
                ...editingContract,
                client_name: e.target.value,
              })
            }
          />
          <label>Contract Value: </label>
          <input
            type="number"
            value={editingContract.contract_details?.value || ""}
            onChange={(e) =>
              setEditingContract({
                ...editingContract,
                contract_details: {
                  ...editingContract.contract_details,
                  value: e.target.value,
                },
              })
            }
          />
          <label>Status: </label>
          <select
            value={editingContract.status}
            onChange={(e) =>
              setEditingContract({ ...editingContract, status: e.target.value })
            }
          >
            <option value="Draft">Draft</option>
            <option value="In Progress">In Progress</option>
            <option value="Finalized">Finalized</option>
          </select>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditingContract(null)}>
            Cancel
          </button>
        </form>
      )}

      {/* Contract Table */}
      <ContractTable
        contracts={contracts}
        total={total}
        filters={filters}
        setFilters={setFilters}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default App;
