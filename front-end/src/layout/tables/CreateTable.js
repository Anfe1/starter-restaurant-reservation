import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function CreateTable() {
  const history = useHistory();
  const [table, setTable] = useState({
    table_name: "",
    capacity: "",
  });

  const [error, setError] = useState(null);

  const submitHandler = (event) => {
    event.preventDefault();
    createTable(table)
      .then(() => {
        history.push(`/dashboard`);
      })
      .catch(setError);
  };

  const changeHandler = ({ target }) => {
    setTable({
      ...table,
      [target.name]: target.value,
    });
  };

  const changeHandlerNumber = ({ target: { name, value } }) => {
    setTable((prevState) => ({ ...prevState, [name]: Number(value) }));
  };

  return (
    <main>
      <h1> Create Table</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="form-group">
        <div className="row mb-3">
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="table_name">
              Table Name
            </label>
            <input
              className="form-control"
              name="table_name"
              id="table_name"
              type="text"
              onChange={changeHandler}
              value={table.table_name}
              required={true}
            />
            <small className="form-text text-muted"> Enter Table Name</small>
          </div>
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="capacity">
              Table Capacity
            </label>
            <input
              className="form-control"
              name="capacity"
              id="capacity"
              type="number"
              required={true}
              onChange={changeHandlerNumber}
              value={table.capacity}
            />
            <small className="form-text text-muted">Enter Table Capacity</small>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary mr-3"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={submitHandler}
        >
          Submit
        </button>
      </form>
    </main>
  );
}

export default CreateTable;
