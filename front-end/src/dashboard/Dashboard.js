import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router-dom";
import ReservationList from "../layout/reservations/ReservationsList";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date);

  const history = useHistory();
  const location = useLocation();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservations() {
      try {
        if (currentDate === date) {
          const response = await listReservations(
            { date },
            abortController.signal
          );
          setReservations(response);
        } else {
          const response = await listReservations(
            { currentDate },
            abortController.signal
          );
          setReservations(response);
        }
      } catch (error) {
        setReservationsError(error);
      }
    }
    loadReservations();
    return () => abortController.abort();
  }, [date, currentDate, history.location]);

  if (reservations) {
    return (
      <main>
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
          <div className="row mb-3">
            <h4 className="mb-0">Reservations for date: {currentDate}</h4>
            <div className="">
              <button className="btn btn-primary ml-3"> Previous Day </button>
            </div>
            <div className="">
              <button className="btn btn-primary ml-3"> Today </button>
            </div>
            <div className="">
              <button className="btn btn-primary ml-3"> Next Day </button>
            </div>
          </div>
        </div>
        <ErrorAlert error={reservationsError} />
        {/* {JSON.stringify(reservations)} */}
        <div>
          <h4> Reservation List </h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col"> ID </th>
                <th scope="col"> First Name </th>
                <th scope="col"> Last Name </th>
                <th scope="col"> Party Size </th>
                <th scope="col"> Phone Number </th>
                <th scope="col"> Date </th>
                <th scope="col"> Time </th>
                <th scope="col"> Status </th>
                <th scope="col"> Seat </th>
                <th scope="col"> Edit </th>
                <th scope="col"> Cancel </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <ReservationList
                  reservationParam={reservation}
                  key={reservation.reservation_id}
                />
              ))}
            </tbody>
          </table>
        </div>
      </main>
    );
  } else {
    return (
      <div>
        <h4> Dashboard Loading...</h4>
      </div>
    );
  }
}

export default Dashboard;
