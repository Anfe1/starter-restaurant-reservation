import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function CreateTable() {
  const [table, setTable] = useState({
    table_name: "",
    capacity: "",
  });
  const [error, setError] = useState(null);

  return (
    <main>
      <h1> Create Table</h1>
      <ErrorAlert error={error} />
      <form className="form-group">
        <div className="row mb-3">
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="table_name">
              {" "}
              Table Name
            </label>
            <input
              className="form-control"
              name="table_name"
              id="table_name"
              required={true}
              type="text"
              value={table.table_name}
            />
            <small className="form-text text-muted"> Enter Table Name</small>
          </div>
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="capacity">
              {" "}
              Table Capacity
            </label>
            <input
              className="form-control"
              name="capacity"
              id="capacity"
              required={true}
              type="text"
              value={table.capacity}
            />
            <small className="form-text text-muted">
              {" "}
              Enter Table Capacity{" "}
            </small>
          </div>
        </div>
        <button type="button" className="btn btn-secondary mr-3">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </main>
  );
}

export default CreateTable;
