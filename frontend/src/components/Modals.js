import React, { useState } from 'react'
import {
  makeStyles,
  Modal,
  Backdrop,
  Button,
  Typography,
  Divider,
  TextField,
} from '@material-ui/core'
import Message from '../components/Message'

import FormContainer from './FormContainer'
import ProgressBar from '../components/ProgressBar'
import { updateContent } from '../actions/instructorActions'
import { useDispatch, useSelector } from 'react-redux'
import { myTrim } from '../utils'
import axios from 'axios'
import { INSTRUCTOR_UPDATE_CONTENT_FAIL } from '../constants/instructorConstants'
import AddQuizModal from './AddQuizModal'

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    pading: '20px',
    width: '400px',
    marginTop: 20,
    flexDirection: 'column',
  },
}))

const Modals = ({ modalOpen = false, modalClose, content, courseId }) => {
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const classes = useStyles()
  const dispatch = useDispatch()
  const [error, setError] = useState(null)
  const [videoUploading, setVideoUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [name, setName] = useState(content.name)
  const [video, setVideo] = useState('')

  const [openQuiz, setOpenQuiz] = useState(false)

  const handleQuizModal = (quizList) => {
    //  add quizlist to content obbject
  }

  const uploadVideoHandler = async (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append(myTrim(name), file)
    setVideoUploading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
      const { data, progress } = await axios.post(
        `/api/upload/${courseId}/course-content`,
        formData,
        config
      )
      setError(false)
      setProgress(progress)
      setVideo(myTrim(data))
      setVideoUploading(false)
    } catch (err) {
      setVideoUploading(false)
      setError(err.message)
      dispatch({ type: INSTRUCTOR_UPDATE_CONTENT_FAIL })
      alert('Please Retry.')
    }
  }

  const updateContentHandler = (e) => {
    e.preventDefault()
    if (content.name === name && content.video === video) {
      modalClose()
    } else {
      dispatch(
        updateContent(courseId, {
          contentId: content._id,
          name,
          video,
        })
      )
      modalClose()
    }
  }

  return (
    <Modal
      className={classes.modal}
      open={modalOpen}
      onClose={modalClose}
      BackdropComponent={Backdrop}
    >
      <div className={classes.paper}>
        <Typography variant='caption'>Chapter {content.chapter}</Typography>
        <Typography variant='h4'>{content.name}</Typography>

        <Divider />
        <form
          onSubmit={updateContentHandler}
          method='post'
          encType='multipart/form-data'
        >
          <div className={classes.form}>
            <FormContainer>
              <TextField
                required
                fullWidth
                type='text'
                label='Content Name'
                placeholder=''
                variant='filled'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormContainer>

            <FormContainer>
              {content.quizzes.length > 0 ? (
                <Button variant='contained' onClick={() => setOpenQuiz(true)}>
                  Edit Quizzes
                </Button>
              ) : (
                <Button variant='contained' onClick={() => setOpenQuiz(true)}>
                  Add Quiz
                </Button>
              )}

              <AddQuizModal
                openQuiz={openQuiz}
                setOpenQuiz={setOpenQuiz}
                quizzes={content.quizzes ? content.quizzes : []}
              />
            </FormContainer>

            <FormContainer>
              <Typography>Video Resource</Typography>
              <input
                type='file'
                name={myTrim(video)}
                placeholder='Enter Image Url'
                onChange={uploadVideoHandler}
              />

              <p style={{ background: '#eee', padding: 7 }}>
                <small>New path name:</small>{' '}
                {content.video ? content.video.substr(34) : '/'}
              </p>
              {videoUploading && <ProgressBar progress={progress} />}
              {error && <Message>{error}</Message>}
            </FormContainer>

            <FormContainer>
              <Button
                variant='outlined'
                type='submit'
                disabled={error ? true : false}
              >
                Done
              </Button>
              <Button size='small' onClick={() => modalClose()}>
                Close
              </Button>
            </FormContainer>
          </div>
        </form>
      </div>
    </Modal>
  )
}
export default Modals
