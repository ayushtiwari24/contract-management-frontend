import React, { useState } from "react";
import Pagination from "./Pagination";

const ContractTable = ({
  contracts,
  total,
  filters,
  setFilters,
  onEdit,
  onDelete,
}) => {
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const handleFilterChange = () => {
    setFilters({
      ...filters,
      client_name: localFilters.client_name,
      status: localFilters.status,
      offset: 0,
    });
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / filters.limit);

  return (
    <div>
      <h2>Contracts</h2>

      {/* Filters */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by Client Name"
          value={localFilters.client_name}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, client_name: e.target.value })
          }
        />
        <select
          value={localFilters.status}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, status: e.target.value })
          }
        >
          <option value="">All</option>
          <option value="Draft">Draft</option>
          <option value="In Progress">In Progress</option>
          <option value="Finalized">Finalized</option>
        </select>
        <button className="filter" onClick={handleFilterChange}>
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contracts.length > 0 ? (
            contracts.map((contract) => (
              <tr key={contract.id}>
                <td>{contract.id}</td>
                <td>{contract.client_name}</td>
                <td>{contract.status}</td>
                <td>
                  <button className="edit" onClick={() => onEdit(contract)}>
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => onDelete(contract.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No contracts available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        currentPage={filters.offset / filters.limit + 1}
        totalPages={totalPages || 1} // Safely fallback to 1
        onPageChange={(page) =>
          setFilters((prev) => ({
            ...prev,
            offset: (page - 1) * filters.limit,
          }))
        }
      />
    </div>
  );
};

export default ContractTable;
