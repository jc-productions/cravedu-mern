import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextareaAutosize,
  Paper,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@material-ui/core'
import FormContainer from '../components/FormContainer'
import { makeStyles } from '@material-ui/core/styles'
import { getCourseById, updateCourse } from '../actions/adminCourseActions'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight'
import {
  ADMIN_COURSE_DETAILS_RESET,
  ADMIN_COURSE_UPDATE_RESET,
} from '../constants/adminConstants'

const useStyles = makeStyles((theme) => ({
  root: {},
  img: {
    width: 120,
  },
  leftPanel: {
    padding: 20,
    minHeight: 200,
  },
  formTextArea: {
    minHeight: 200,
    minWidth: '100%',
  },
}))

const CourseEditScreen = ({ match, history }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const courseId = match.params.id

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const adminCourseDetails = useSelector((state) => state.adminCourseDetails)
  const { courseDetails, loading, error } = adminCourseDetails

  const adminCourseUpdate = useSelector((state) => state.adminCourseUpdate)
  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
  } = adminCourseUpdate

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [uploading, setUploading] = useState(false)

  const myTrim = (name) => {
    return String(name.replace(/ /g, '').toLowerCase())
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append(myTrim(name), file)
    setUploading(true)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post(
        '/api/upload/course-image',
        formData,
        config
      )

      setImage(myTrim(data))
      setUploading(false)
    } catch (e) {
      console.error(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateCourse({
        _id: courseId,
        name,
        price,
        image,
        description,
        isPublished,
      })
    )
  }

  const handlePublishedCheck = (e, isChecked) => {
    setIsPublished(isChecked)
  }

  // useEffect
  // check if user existed
  // check if course details exisited
  useEffect(() => {
    if (updateSuccess) {
      dispatch({ type: ADMIN_COURSE_DETAILS_RESET })
      dispatch({ type: ADMIN_COURSE_UPDATE_RESET })
      history.push('/admin/courses')
    } else {
      if (userInfo && userInfo.isAdmin) {
        if (
          !courseDetails ||
          !courseDetails.name ||
          !courseDetails.image ||
          !courseDetails.description ||
          courseDetails._id !== courseId
        ) {
          setName('')
          setPrice(0)
          setDescription('')
          setImage('')
          setIsPublished(false)
          dispatch(getCourseById(courseId))
        } else {
          setName(courseDetails.name)
          setPrice(courseDetails.price)
          setDescription(courseDetails.description)
          setImage(courseDetails.image)
          setIsPublished(courseDetails.isPublished)
        }
      } else {
        history.push('/login')
      }
    }
  }, [userInfo, courseDetails, dispatch, courseId, history, updateSuccess])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message>{error}</Message>
  ) : (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Button onClick={() => history.push('/admin/courses')}>Go Back</Button>|
        <Button onClick={() => history.push('/admin/users')}>
          Go To Manage Users
        </Button>
      </Grid>
      <h1>
        <SubdirectoryArrowRightIcon /> {courseDetails.name}
      </h1>
      {updateLoading && <Loader />}
      {updateError && <Message>{updateError}</Message>}
      <Grid container spacing={3}>
        <Grid item xs={5}>
          <Paper className={classes.leftPanel}>
            <img src={image} alt='' className={classes.img} />
            <p style={{ background: '#eee', padding: 7 }}>
              {image.substr(8, 40)}
            </p>
            <form
              onSubmit={submitHandler}
              method='post'
              encType='multipart/form-data'
            >
              <FormContainer>
                <input
                  type='file'
                  name={myTrim(name)}
                  placeholder='Enter Image Url'
                  onChange={uploadFileHandler}
                />
                {uploading && <Loader left />}
              </FormContainer>

              <FormContainer>
                <TextField
                  required
                  fullWidth
                  id='name'
                  type='text'
                  label='Course Name'
                  placeholder=''
                  variant='filled'
                  value={name}
                  autoComplete='text'
                  onChange={(e) => setName(e.target.value)}
                />
              </FormContainer>
              <FormContainer>
                <TextField
                  required
                  fullWidth
                  id='price'
                  type='number'
                  label='Price (MYR)'
                  placeholder=''
                  variant='filled'
                  value={price}
                  autoComplete='number'
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FormContainer>
              <FormContainer>
                <TextareaAutosize
                  className={classes.formTextArea}
                  required
                  id='description'
                  type='text'
                  label='Description'
                  placeholder=''
                  variant='filled'
                  defaultValue={description}
                  autoComplete='text'
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormContainer>

              <FormContainer>
                <FormControlLabel
                  label='Published'
                  control={
                    <Checkbox
                      checked={isPublished}
                      onChange={handlePublishedCheck}
                      name='isPublished'
                      color='primary'
                    />
                  }
                />
              </FormContainer>

              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
              >
                Update
              </Button>
            </form>
          </Paper>

          <Divider />
          <h2>Total Sales</h2>
          <Paper>
            {courseDetails.totalSold ? (
              <Typography variant='h3' component='h3' style={{ padding: 10 }}>
                {courseDetails.totalSold}
              </Typography>
            ) : (
              <Message severity='info'>No sales</Message>
            )}
          </Paper>

          <Divider />
        </Grid>
        <Grid item xs={7}>
          <h2>Course Contents</h2>
          <Paper>
            <List>
              {courseDetails.courseContents ? (
                courseDetails.courseContents.length === 0 ? (
                  <Message severity='info'>Nothing...</Message>
                ) : (
                  courseDetails.courseContents.map((course, index) => (
                    <div key={course._id}>
                      <ListItem>
                        <ListItemText
                          primary={`${index + 1}.  ${course.name}`}
                        />
                        <Button>Edit</Button>
                      </ListItem>
                      <Divider />
                    </div>
                  ))
                )
              ) : (
                <Message>Something went wrong</Message>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CourseEditScreen