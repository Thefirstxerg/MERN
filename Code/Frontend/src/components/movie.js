import React, { useState, useEffect } from 'react'
import MovieDataService from '../services/movies'
import { Link } from 'react-router-dom'
import {Card, Container, Image, Col, Row, Button, Media }from 'react-bootstrap';
import moment from 'moment';

const Movie = props => {
   //default state
   const [movie, setMovie] = useState({
      id: null,
      title: '',
      rated: '',
      reviews: []
   })

   //getting a specific movie's information
   const getMovie = id => {
      MovieDataService.get(id)
         .then(response => {
            setMovie(response.data)
            console.log(response.data)
         })
         .catch(e => {
            console.log(e)
         })
   }

   //renders specific movie info once- onfirst render
   useEffect(() => {
      getMovie(props.match.params.id)
   }, [props.match.params.id])

   const deleteReview = (reviewId, index) => {
      //identify review by review and user ids
      MovieDataService.deleteReview(reviewId, props.user.id)
         .then(response => {
            setMovie((prevState) => {
               //put index into splice method to remove that review from list/database
               prevState.reviews.splice(index, 1)
               return ({
                  ...prevState
               })
            })
         })
         .catch(e => {
            //print error message
            console.log(e)
         })
   }

   return (
      <div>
         {/* card to display a specific movie's information */}
         <Container>
            <Row>
               <Col>
                  <Image src={movie.poster + "/100px250"} fluid />
               </Col>
               <Col>
                  <Card>
                     <Card.Header as="h5">{movie.title}</Card.Header>
                     <Card.Body>
                        <Card.Text style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                           {movie.plot}
                        </Card.Text>
                        <hr style={{ borderTop: '2px solid #bbb', margin: '1.5rem 0' }} />
                        <h5 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Reviews</h5>
                        {movie.reviews.length === 0 && (
                           <div style={{ color: '#888', fontStyle: 'italic', marginBottom: '1rem' }}>No reviews yet.</div>
                        )}
                        {movie.reviews.map((review, index) => {
                           return (
                              <Media key={index} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
                                 <Media.Body>
                                    <h6 style={{ fontWeight: 'bold', color: '#007bff' }}>{review.name + " reviewed on "} {moment(review.date).format("Do MMMM YYYY")}</h6>
                                    <p style={{ marginBottom: '0.5rem' }}>{review.review}</p>
                                    {props.user && props.user.id === review.user_id &&
                                       <Row>
                                          <Col><Link to={{
                                             pathname: "/movies/" +
                                                props.match.params.id +
                                                "/review",
                                             state: { currentReview: review }
                                          }}>Edit</Link>
                                          </Col>
                                          <Col><Button variant="link" onClick={() => deleteReview(review._id, index)}>Delete</Button></Col>
                                       </Row>
                                    }
                                 </Media.Body>
                              </Media>
                           )
                        })}
                        {props.user &&
                           <div style={{ marginTop: '1rem' }}>
                              <Link to={"/movies/" + props.match.params.id + "/review"}>
                                 <Button variant="primary">Add Review</Button>
                              </Link>
                           </div>}
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </Container>
      </div>
   )
}

export default Movie;