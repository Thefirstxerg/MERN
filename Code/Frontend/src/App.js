import './App.css';
import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddReview from "./components/add-review";
import MoviesList from "./components/movies-list";
import Movie from "./components/movie";
import Login from "./components/login";
import Contact from "./components/contact";
import {Nav, Navbar} from 'react-bootstrap';

// Main App component
function App() {
  // State to keep track of the logged-in user
  const [user, setUser] = React.useState(null);

  // Function to log in a user
  async function login(user = null) {
    setUser(user)
  }
  // Function to log out the user
  async function logout() {
    setUser(null)
  }

  return (
    <div className="App">
      {/* Navigation bar using react-bootstrap */}
      <Navbar bg="light" expand="lg">
        <Navbar.Brand >Movie Reviews</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {/* Link to Movies list */}
            <Nav.Link>
              <Link to={'/movies'}>Movies</Link>
            </Nav.Link>
            {/* Link to Contact page */}
            <Nav.Link>
              <Link to={'/contact'}>Contact</Link>
            </Nav.Link>
            {/* Show Login or Logout depending on user state */}
            <Nav.Link>
              {user ? (
                <button onClick={logout}>Logout User</button>
              ) : (
                <Link to={"/login"}>Login</Link>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Routing for different pages */}
      <Switch>
        {/* Movies list page (default and /movies) */}
        <Route exact path={["/", "/movies"]} component={MoviesList}>
        </Route>
        {/* Add review page, passes user as prop */}
        <Route path="/movies/:id/review" render={(props) =>
          <AddReview {...props} user={user} />
        }>
        </Route>
        {/* Movie details page, passes user as prop */}
        <Route path="/movies/:id/" render={(props) =>
          <Movie {...props} user={user} />
        }>
        </Route>
        {/* Login page, passes login function as prop */}
        <Route path="/login" render={(props) =>
          <Login {...props} login={login} />
        }>
        </Route>
        {/* Contact page */}
        <Route path="/contact" component={Contact} />
      </Switch>
    </div>
  );
}

export default App;