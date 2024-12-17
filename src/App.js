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

  // Fetch contracts initially and whenever filters change
  useEffect(() => {
    fetchContracts();

    const socket = io("http://localhost:5000");

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

    return () => socket.disconnect();
  }, [filters]);

  const fetchContracts = async () => {
    try {
      const response = await getContracts(filters);
      setContracts(response.data.contracts || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        setFileData(jsonData);
      } catch (err) {
        alert("Invalid JSON format");
      }
    };
    reader.readAsText(file);
  };

  const handleSubmitFile = async () => {
    if (fileData) {
      try {
        for (const contract of fileData) {
          const response = await fetch("http://localhost:5000/api/contracts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contract),
          });

          if (response.status === 409) {
            const result = await response.json();
            console.warn(`Duplicate contract: ${contract.client_name}`);
            alert(`Duplicate contract skipped: ${contract.client_name}`);
            continue;
          }

          if (!response.ok) {
            throw new Error(
              `Failed to upload contract: ${contract.client_name}`
            );
          }
        }

        alert("Contracts uploaded successfully!");
        setFileData(null);
        fetchContracts();

        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset the file input value
        }
      } catch (err) {
        console.error("Error uploading file:", err);
        alert("An error occurred while uploading contracts.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContract(id);
      alert("Contract deleted successfully!");
    } catch (error) {
      console.error("Error deleting contract:", error);
    }
  };

  const handleEdit = (contract) => {
    setEditingContract(contract);
  };

  const handleUpdateContract = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/contracts/${editingContract.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingContract),
      });
      alert("Contract updated successfully!");
      setEditingContract(null);
    } catch (err) {
      console.error("Error updating contract:", err);
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
