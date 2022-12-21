import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router-dom";
import ReservationList from "../layout/reservations/ReservationsList";
import { previous, next } from "../utils/date-time";

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
  const searchDate = location.search.slice(-10);

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

  useEffect(() => {
    if (searchDate && searchDate !== "") {
      setCurrentDate(searchDate);
    }
  }, [searchDate, history]);

  //Previous button handler
  const previousHandler = (event) => {
    event.preventDefault();
    history.push("/dashboard");
    setCurrentDate(previous(currentDate));
  };

  //Next button handler
  const nextHandler = (event) => {
    event.preventDefault();
    history.push("/dashboard");
    setCurrentDate(next(currentDate));
  };

  //today button handler
  const todayHandler = (event) => {
    event.preventDefault();
    history.push("/dashboard");
    setCurrentDate(date);
  };

  if (reservations) {
    return (
      <main>
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
          <div className="row mb-3">
            <h4 className="mb-0">Reservations for date: {currentDate}</h4>
            <div className="">
              <button
                className="btn btn-primary ml-3"
                onClick={previousHandler}
              >
                Previous Day
              </button>
            </div>
            <div className="">
              <button className="btn btn-primary ml-3" onClick={todayHandler}>
                {" "}
                Today{" "}
              </button>
            </div>
            <div className="">
              <button className="btn btn-primary ml-3" onClick={nextHandler}>
                {" "}
                Next Day{" "}
              </button>
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
