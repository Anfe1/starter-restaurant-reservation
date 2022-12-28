import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { listTables } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ListTables({ table }) {
  const [currentTable, setCurrentTable] = useState(table);
  const history = useHistory();
  const [error, setError] = useState(null);

  async function loadTables() {
    const abortController = new AbortController();
    try {
      setCurrentTable();
      listTables();
    } catch (error) {
      setError(error);
    }
  }

  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope="row"> {currentTable.table_id}</th>
        <td> {currentTable.table_name} </td>
        <td> {currentTable.capacity}</td>
        <td> {currentTable.reservation_id}</td>
        <td data-table-id-status={`${table.table_id}`}>
          {" "}
          {currentTable.status}
        </td>
        <td>
          {" "}
          {currentTable.reservation_id ? (
            <button
              className="btn btn-danger"
              data-table-id-finish={`${table.table_id}`}
            >
              Finish
            </button>
          ) : (
            <></>
          )}
        </td>
      </tr>
    </>
  );
}

export default ListTables;
