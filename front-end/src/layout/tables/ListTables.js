import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";

function ListTables({ table }) {
  const [currentTable, setCurrentTable] = useState(table);
  const history = useHistory();
  const [error, setError] = useState(null);

  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope="row"> {currentTable.table_id}</th>
        <td> {currentTable.table_name} </td>
      </tr>
    </>
  );
}

export default ListTables;
