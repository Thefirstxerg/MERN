import React, { useState, useEffect } from 'react';
import MovieDataService from "../services/movies";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

// MoviesList component displays a list of movies with search and pagination
const MoviesList = props => {

   // State variables for movies, search fields, ratings, pages, and search mode
   const [movies, setMovies] = useState([])
   const [searchTitle, setSearchTitle] = useState("")
   const [searchRating, setSearchRating] = useState("")
   const [ratings, setRatings] = useState(["All Ratings"])
   const [currentPage, setCurrentPage] = useState(0); // current page number
   const [entriesPerPage, setEntriesPerPage] = useState(0); // number of entries per page
   const [currentSearchMode, setCurrentSearchMode] = useState(""); // search mode: by title or rating

   // Reset to first page when search mode changes
   useEffect(() => {
      setCurrentPage(0)
      // eslint-disable-next-line 
   }, [currentSearchMode])

   // Fetch next page of movies when currentPage changes
   useEffect(() => {
      retrieveNextPage()
      // eslint-disable-next-line 
   }, [currentPage])

   // Decide which retrieval function to call based on search mode
   const retrieveNextPage = () => {
      if (currentSearchMode === 'findByTitle')
         findByTitle()
      else if (currentSearchMode === 'findByRating')
         findByRating()
      else
         retrieveMovies()
   }

   // On component mount, fetch all movies and ratings
   useEffect(() => {
      retrieveMovies()
      retrieveRatings()
      // eslint-disable-next-line 
   }, [])

   // Fetch all movies for the current page
   const retrieveMovies = () => {
      setCurrentSearchMode("")
      MovieDataService.getAll(currentPage)
         .then(response => {
            console.log(response.data)
            setMovies(response.data.movies)
            setCurrentPage(response.data.page)
            setEntriesPerPage(response.data.entries_per_page)
         })
         .catch(e => {
            console.log(e)
         })
   }

   // Fetch all available ratings for the dropdown
   const retrieveRatings = () => {
      MovieDataService.getRatings()
         .then(response => {
            console.log(response.data)
            setRatings(["All Ratings"].concat(response.data))
         })
         .catch(e => {
            console.log(e)
         })
   }

   // Handlers for search input changes
   const onChangeSearchTitle = e => {
      const searchTitle = e.target.value
      setSearchTitle(searchTitle);
   }

   const onChangeSearchRating = e => {
      const searchRating = e.target.value
      setSearchRating(searchRating);
   }

   // Reset search form and reload all movies
   const clearForm = () => {
      setSearchTitle("");
      setSearchRating("All Ratings");
      setCurrentSearchMode("");
      setCurrentPage(0);
      retrieveMovies();
   }

   // Generic find function for searching by title or rating
   const find = (query, by) => {
      MovieDataService.find(query, by, currentPage)
         .then(response => {
            console.log(response.data)
            setMovies(response.data.movies)
         })
         .catch(e => {
            console.log(e)
         })
   }

   // Search by title
   const findByTitle = () => {
      setCurrentSearchMode("findByTitle")
      find(searchTitle, "title")
   }

   // Search by rating, or show all if "All Ratings" is selected
   const findByRating = () => {
      setCurrentSearchMode("findByRating")
      if (searchRating === "All Ratings") {
         retrieveMovies()
      }
      else {
         find(searchRating, "rated")
      }
   }

   return (
      <div className="App">
         <Container>
            {/* Search form for title and rating */}
            <Form>
               <Row>
                  <Col>
                     <Form.Group>
                        <Form.Control
                           type="text"
                           placeholder="Search by title"
                           value={searchTitle}
                           onChange={onChangeSearchTitle}
                        />
                     </Form.Group>
                     <Button
                        variant="primary"
                        type="button"
                        onClick={findByTitle}
                     >
                        Search
                     </Button>
                  </Col>
                  <Col>
                     <Form.Group>
                        <Form.Control as="select" onChange={onChangeSearchRating} >
                           {ratings.map(rating => {
                              return (
                                 <option value={rating}>{rating}</option>
                              )
                           })}
                        </Form.Control>
                     </Form.Group>
                     <Button
                        variant="primary"
                        type="button"
                        onClick={findByRating}
                     >
                        Search
                     </Button>
                  </Col>
               </Row>
               <Button
                  variant="secondary"
                  type="button"
                  onClick={clearForm}
                  style={{ marginBottom: '1rem' }}
               >
                  Reset Search
               </Button>
            </Form>

            {/* Display movies as cards */}
            <Row>
               {movies.map((movie) => {
                  return (
                     <Col>
                        <Card style={{ width: '18rem' }}>
                           <Card.Img src={movie.poster + "/100px180"} />
                           <Card.Body>
                              <Card.Title>{movie.title}</Card.Title>
                              <Card.Text>
                                 Rating: {movie.rated}
                              </Card.Text>
                              <Card.Text>
                                 {movie.plot}
                              </Card.Text>
                              <Link to={"/movies/" + movie._id} >View Reviews</Link>
                           </Card.Body>
                        </Card>
                     </Col>
                  )
               })}
            </Row>

         </Container><br />
         {/* Pagination controls */}
         Showing page: {currentPage}
         <Button
            variant="link"
            onClick={() => { setCurrentPage(currentPage + 1) }}
         >
            Get next {entriesPerPage} results
         </Button>
      </div>
   );
}

export default MoviesList;
