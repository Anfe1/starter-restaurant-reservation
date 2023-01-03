import React from "react";

import { finishTable } from "../../utils/api";

function ListTables({ table, loadDashboard }) {
  const { table_id, table_name, capacity, reservation_id } = table;

  async function handleClear() {
    const confirmBox = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (confirmBox === true) {
      finishTable(table_id)
        .then(loadDashboard)
        .catch((error) => console.log(error));
    }
    return null;
  }

  return (
    <>
      <tr>
        <th scope="row"> {table_id}</th>
        <td> {table_name} </td>
        <td> {capacity}</td>
        <td> {reservation_id}</td>
        <td data-table-id-status={`${table_id}`}>
          {reservation_id ? "occupied" : "free"}
        </td>
        <td>
          {reservation_id ? (
            <button
              className="btn btn-danger"
              onClick={handleClear}
              data-table-id-finish={`${table_id}`}
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
