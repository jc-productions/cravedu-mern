import React, { useEffect } from 'react'
import {
  Grid,
  Button,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Table,
  Typography,
} from '@material-ui/core'
import { listCourses } from '../actions/instructorActions'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { INSTRUCTOR_COURSE_LIST_RESET } from '../constants/instructorConstants'
import Breadcrumbs from '../components/Breadcrumbs'

const InstructorScreen = ({ history }) => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const instructorCourseList = useSelector(
    (state) => state.instructorCourseList
  )
  const { courses, loading, error } = instructorCourseList

  const goToEdit = (id) => {
    history.push(`/admin/${id}/edit`)
  }

  useEffect(() => {
    if (userInfo && userInfo.isInstructor) {
      dispatch({ type: INSTRUCTOR_COURSE_LIST_RESET })
      dispatch(listCourses())
    } else {
      history.push('/login')
    }
  }, [userInfo, dispatch, history])

  return (
    <>
      <Breadcrumbs
        previousPage={[
          {
            name: 'Home',
            link: '/',
          },
        ]}
        currentPage='Instructor'
      />

      <Grid container style={{ marginTop: 10 }}>
        <Grid item xs={12}>
          <Button style={{ marginRight: 10 }} onClick={() => history.push('/')}>
            Go Back
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => alert('create course')}
          >
            Create New Course
          </Button>
        </Grid>

        <Grid item xs={12}>
          {error ? (
            <Message>{error}</Message>
          ) : loading ? (
            <Loader />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='center'>Published</TableCell>
                    <TableCell align='center'>Price (MYR)</TableCell>
                    <TableCell align='center'>Instructor</TableCell>
                    <TableCell align='center'>Chapters </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course, index) => (
                    <TableRow key={course._id}>
                      <TableCell align='center'>{index + 1}</TableCell>
                      <TableCell>
                        <b>{course.name}</b> <br />
                        <Typography variant='caption' component='span'>
                          ({course._id})
                        </Typography>
                      </TableCell>
                      <TableCell align='center'>
                        {course.isPublished ? (
                          <span>Yes</span>
                        ) : (
                          <span>No</span>
                        )}
                      </TableCell>
                      <TableCell align='center'>{course.price}</TableCell>
                      <TableCell align='center'>{course.instructor}</TableCell>
                      <TableCell align='center'>
                        {course.courseContents.length}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => goToEdit(course._id)}
                          variant='outlined'
                        >
                          Edit Info
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default InstructorScreen
