import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  ListItem,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import Modals from './Modals'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useDispatch, useSelector } from 'react-redux'
import {
  INSTRUCTOR_COURSE_DETAILS_RESET,
  INSTRUCTOR_DELETE_CONTENT_RESET,
  INSTRUCTOR_UPDATE_CONTENT_RESET,
} from '../constants/instructorConstants'
import { deleteContent } from '../actions/instructorActions'
import Message from './Message'

const ContentListItem = ({ courseId, content, count }) => {
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(null)

  const instructorContentUpdate = useSelector(
    (state) => state.instructorContentUpdate
  )
  const { success: contentUpdateSuccess } = instructorContentUpdate

  const instructorContentDelete = useSelector(
    (state) => state.instructorContentDelete
  )
  const {
    loading: contentDeleteLoading,
    success: contentDeleteSuccess,
    error: contentDeleteError,
  } = instructorContentDelete

  const deletChapter = () => {
    const msg = `Are you sure to delete this chapter?\n${
      content.video ? '(Video will be deleted as well)' : ''
    }`

    if (window.confirm(msg)) {
      dispatch(deleteContent(courseId, content._id))
    }
  }

  useEffect(() => {
    if (contentUpdateSuccess || contentDeleteSuccess) {
      dispatch({ type: INSTRUCTOR_DELETE_CONTENT_RESET })
      dispatch({ type: INSTRUCTOR_UPDATE_CONTENT_RESET })
      dispatch({ type: INSTRUCTOR_COURSE_DETAILS_RESET })
    }
  }, [contentUpdateSuccess, contentDeleteSuccess])

  return (
    <div key={content._id}>
      <ListItem>
        <Accordion style={{ width: '100%', background: '#efefef' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {`${count}. ${content.name}`}
          </AccordionSummary>

          <AccordionDetails>
            <Button
              variant='outlined'
              type='button'
              onClick={() => setModalOpen(true)}
            >
              Edit
            </Button>
            <Button onClick={deletChapter} type='button'>
              Delete This Chapter
            </Button>

            <Modals
              modalOpen={modalOpen}
              modalClose={() => setModalOpen(false)}
              courseId={courseId}
              content={content}
            />
          </AccordionDetails>
          {contentDeleteLoading && (
            <Message variant='info'>Deleting...</Message>
          )}
          {contentDeleteError && <Message>{contentDeleteError}</Message>}
        </Accordion>
      </ListItem>
      <Divider />
    </div>
  )
}

export default ContentListItem