import React, { useState } from "react";
import { createContract, updateContract } from "../services/api";

const ContractForm = ({ contract, onSave }) => {
  const [form, setForm] = useState(
    contract || { client_name: "", contract_details: "", status: "" }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateContract(form.id, form);
      } else {
        await createContract(form);
      }
      onSave();
    } catch (error) {
      console.error("Error saving contract:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="client_name"
        value={form.client_name}
        onChange={handleChange}
        placeholder="Client Name"
      />
      <textarea
        name="contract_details"
        value={form.contract_details}
        onChange={handleChange}
        placeholder="Details"
      />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="Draft">Draft</option>
        <option value="Finalized">Finalized</option>
        <option value="In Progress">In Progress</option>
      </select>
      <button type="submit">{form.id ? "Update" : "Create"}</button>
    </form>
  );
};

export default ContractForm;
