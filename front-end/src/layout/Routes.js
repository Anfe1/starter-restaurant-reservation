import React, { useState, useEffect } from "react";

import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ReservationNew from "../layout/reservations/ReservationNew";
import CreateTable from "../layout/tables/CreateTable";
import ReservationSeating from "../layout/reservations/ReservationSeating";
import SearchReservations from "../layout/reservations/SearchReservations";
import EditReservation from "../layout/reservations/EditReservation";
import ReservationStatus from "../layout/reservations/ReservationStatus";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [date, setDate] = useState(today());

  const url = useRouteMatch();
  const query = useQuery();

  function loadDate() {
    const dateNew = query.get("date");
    if (dateNew) {
      setDate(dateNew);
    }
  }

  useEffect(loadDate, [url, query]);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact path="/reservations/new">
        <ReservationNew date={date} />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeating date={today()} />
      </Route>
      <Route path="/reservations/:reservation_id/status">
        <ReservationStatus />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route exact path="/tables">
        <Dashboard date={date} />
      </Route>
      <Route path="/tables/new">
        <CreateTable />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date || today()} />
      </Route>
      <Route exact={true} path="/search">
        <SearchReservations />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
