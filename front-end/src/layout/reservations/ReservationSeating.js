import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { listTables, updateSeating } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationSeating({ date }) {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState("");

  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(loadTables, [reservation_id]);

  //Load tables
  function loadTables() {
    const abortController = new AbortController();

    setError(null);
    listTables(abortController.signal).then(setTables).catch(setError);

    return () => abortController.abort();
  }

  const rows = tables.map((table) => {
    return (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  //submit button
  const submitHandler = (event) => {
    event.preventDefault();

    const abortController = new AbortController();
    setError(null);
    updateSeating(tableId, reservation_id, abortController.signal)
      .then(() => history.push("/dashboard"))
      .catch(setError);
    return () => abortController.abort();
  };

  const changeHandler = ({ target }) => {
    setTableId(Number(target.value));
  };

  return (
    <div>
      <div>Seat A Table</div>
      <ErrorAlert error={error} />

      <form onSubmit={submitHandler}>
        <div className="form-row align-items-center">
          <div className="col-auto my-1">
            <select
              className="custom-select mr-sm-2"
              name="table_id"
              required
              onChange={changeHandler}
            >
              <option defaultValue={0}>Choose...</option>
              {rows}
            </select>
          </div>

          <div className="col-auto my-1">
            <button type="submit" className="btn btn-primary">
              Seat
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={history.goBack}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReservationSeating;
