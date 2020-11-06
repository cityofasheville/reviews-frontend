import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Radio, RadioGroup } from 'react-radio-group';
import moment from 'moment';
import CheckInInstructions from 'app/CheckInInstructions';
import DatePickerWrapper from 'app/DatePickerWrapper';
import Question from 'app/Question';
import Response from 'app/Response';

const getResponse = (questionId, responses) => {
  // assumes 1:1 relationship between a question and a response
  for (const response of responses) {
    if (questionId === response.question_id) {
      return response;
    }
  }
  return null;
};

const getMainReviewResponse = (responses) => {
  for (const response of responses) {
    if (response.question_id === null) {
      return response;
    }
  }
  return null;
};

const showSaveSuccess = (id) => {
  if (document.getElementById(id)) {
    document.getElementById(id).style.display = 'block';
    setTimeout(() => {
      document.getElementById(id).style.display = 'none';
    }, 3000);
  }
};

const validate = (state, onSubmit) => {
  let invalidQuestions = [];
  const answeredQuestions = [];

  if (onSubmit) {
    if (state.answersEditable) {
      for (const question of state.questions) {
        if (!question.answer || question.answer === '') {
          invalidQuestions.push(question.id);
        } else {
          answeredQuestions.push(question.id);
        }
      }
      if (answeredQuestions.length > 0) {
        invalidQuestions = [];
      }
    }
  }

  return {
    endDate: state.periodEnd == null,
    questions: onSubmit ? invalidQuestions : state.questions,
    responses: onSubmit ? [] : state.responses,
  };
};

const submitReview = gql`
  mutation updateReview($id: Int, $reviewInput: ReviewInput!) {
    updateReview (id: $id, review: $reviewInput) {
      id
      status
      status_date
      supervisor_id
      employee_id
      position
      periodStart
      periodEnd
      reviewer_name
      employee_name
      questions {
        id
        type
        question
        answer
        required
      }
      responses {
        question_id
        Response
      }
    }
  }
`;

let autoSaveInterval = null;

class Review extends React.Component {
  constructor(props) {
    super(props);
    const { review, userId, lastReviewed } = this.props;
    const initialErrors = validate({
      periodEnd: review.periodEnd,
      questions: [],
      responses: [],
    });
    const role = review.employee_id === userId ? 'Employee' : 'Supervisor';
    this.state = {
      periodStart: review.status === 'Closed'
        ? review.previousReviewDate
        : lastReviewed,
      periodEnd: review.periodEnd,
      questions: review.questions,
      responses: review.responses,
      role: review.employee_id === userId // eslint-disable-line no-nested-ternary
        ? 'Employee'
        : (userId === review.supervisor_id
          ? 'Supervisor' //TODO: implement the current supervisor stuff
          : 'Viewer'),
      answersEditable: review.status === 'Open' && role === 'Supervisor',
      responsesEditable: review.status === 'Ready' && role === 'Employee',
      actionRadio: 'saveprogress', // todo set appropriate action value based on other vars,
      validationErrors: initialErrors,
      formError: initialErrors.startDate
        || initialErrors.endDate
        || initialErrors.questions.length > 0
        || initialErrors.responses.length > 0,
      modalIsOpen: false,
      stayOnPageAfterSave: true,
      changesSinceLastSave: 0,
      activeSaveId: 'saveSuccess2',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleTextEditorChange = this.handleTextEditorChange.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleModalContinue = this.handleModalContinue.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { actionRadio } = this.state;
    if (actionRadio !== nextState.actionRadio) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    clearInterval(autoSaveInterval);
  }

  handleOpenModal(submitFunction) {
    const { changesSinceLastSave } = this.state;
    const { review, history } = this.props;
    if (changesSinceLastSave > 0) {
      this.handleSubmit(submitFunction, true, 'none');
    }
    const path = `/check-in?emp=${review.employee_id}&check-in=${review.id}&printable=yes`;
    history.push(path);
  }

  handleModalContinue() {
    const { review, history } = this.props;
    this.setState({ modalIsOpen: false });
    const path = `/check-in?emp=${review.employee_id}&check-in=${review.id}&printable=yes`;
    history.push(path);
  }

  handleCloseModal() {
    this.setState({ modalIsOpen: false });
  }

  handleSubmit(submitFunction, auto, saveId) {
    const { review } = this.props;
    const {
      actionRadio,
      periodEnd,
      questions,
      responses,
    } = this.state;
    this.setState({ stayOnPageAfterSave: actionRadio === 'saveprogress' });
    if (auto === true) {
      this.setState({ stayOnPageAfterSave: true });
    }
    if (saveId !== undefined) {
      this.setState({ activeSaveId: saveId });
    } else {
      this.setState({ activeSaveId: 'saveSuccess2' });
    }
    let newStatus = review.status;
    if (auto !== true) {
      if (actionRadio !== 'saveonly' && actionRadio !== 'saveprogress' && this.hasErrors()) {
        return;
      }
      if (actionRadio !== 'saveonly' && actionRadio !== 'saveprogress') {
        newStatus = actionRadio;
      }
    }
    submitFunction({
      variables: {
        id: review.id,
        reviewInput: {
          status: newStatus,
          periodEnd,
          questions: questions.map(question => ({
            answer: question.answer,
            id: question.id,
          })),
          responses: responses.map(response => ({
            question_id: response.question_id,
            Response: response.Response,
          })),
        },
      },
    });
  }

  handleEndDateChange(value, submitFunction) {
    this.setState({
      periodEnd: value != null ? value.format('M/DD/YYYY') : value,
    }, () => this.handleSubmit(submitFunction, true));
  }

  handleTextEditorChange(event, submitFunction) {
    const {
      changesSinceLastSave,
      responses,
      questions,
    } = this.state;
    let splitId;
    let content;
    if (event.type === 'blur') {
      splitId = event.target.id.split('-');
      content = event.target.getContent();
    } else {
      this.setState({ changesSinceLastSave: changesSinceLastSave + 1 });
      splitId = event.target.getAttribute('data-id').split('-');
      content = event.target.innerHTML;
    }
    const questionOrResponse = splitId[0];
    const id = splitId[1] === '' ? null : splitId[1];
    if (questionOrResponse === 'response') {
      const newResponses = [];
      for (let i = 0; i < responses.length; i += 1) {
        if (id == responses[i].question_id) {
          newResponses.push(Object.assign({}, responses[i], { Response: content }));
        } else {
          newResponses.push(Object.assign({}, responses[i]));
        }
      }
      this.setState({ responses: newResponses }, () => {
        if (changesSinceLastSave > 50) {
          this.handleSubmit(submitFunction, true, 'none');
        }
      });
    } else {
      const newQuestions = [];
      for (let i = 0; i < questions.length; i += 1) {
        if (id == questions[i].id) {
          newQuestions.push(Object.assign({}, questions[i], { answer: content }));
        } else {
          newQuestions.push(Object.assign({}, questions[i]));
        }
      }
      this.setState({ questions: newQuestions }, () => {
        if (changesSinceLastSave > 50) {
          this.handleSubmit(submitFunction, true, 'none');
        }
      });
    }
  }

  handleRadioQuestionChange(value, questionId, submitFunction) {
    const { questions } = this.state;
    const newQuestions = [];
    for (let i = 0; i < questions.length; i += 1) {
      if (questionId == questions[i].id) {
        newQuestions.push(Object.assign({}, questions[i], { answer: value }));
      } else {
        newQuestions.push(Object.assign({}, questions[i]));
      }
    }
    this.setState(
      { questions: newQuestions },
      () => this.handleSubmit(submitFunction, true, 'none')
    );
  }

  hasErrors() {
    const validationErrors = validate(this.state, true);
    this.setState({ validationErrors });
    const invalid = validationErrors.startDate
      || validationErrors.endDate
      || validationErrors.questions.length > 0
      || validationErrors.responses.length > 0;
    this.setState({ formError: invalid });
    if (invalid) {
      document.getElementById('formValidationError').style.display = 'block';
    }
    return invalid;
  }

  render() {
    const dateErrors = validate(this.state);
    const {
      actionRadio,
      activeSaveId,
      answersEditable,
      changesSinceLastSave,
      periodEnd,
      periodStart,
      responsesEditable,
      role,
      stayOnPageAfterSave,
    } = this.state;
    const { history, review } = this.props;
    return (
      <Mutation
        mutation={submitReview}
        onError={(error) => {
          if (document.getElementById('errorDetails')) {
            document.getElementById(
              'errorDetails'
            ).innerHTML = `<span>Error details: </span> ${error}`;
            document.getElementById('serverError').style.display = 'block';
          }
          window.scrollTo(document.body, 0, 100);
        }}
        onCompleted={(data) => {
          if (!stayOnPageAfterSave) {
            history.push(`/?emp=${data.updateReview.employee_id}&mode=check-ins`);
          }
          this.setState({ changesSinceLastSave: 0 });
          if (activeSaveId !== 'none' && document.getElementById(activeSaveId)) {
            showSaveSuccess(activeSaveId);
          }
          if (document.getElementById('formValidationError')) {
            document.getElementById('formValidationError').style.display = 'none';
          }
          if (document.getElementById('serverError')) {
            document.getElementById('serverError').style.display = 'none';
          }
        }}
        ignoreResults
      >
        {(submit, { loading, error, data }) => {
          if (answersEditable || responsesEditable) {
            if (autoSaveInterval === null) {
              autoSaveInterval = setInterval(() => {
                if (changesSinceLastSave > 0) {
                  this.handleSubmit(submit, true, 'none');
                }
              }, 10000);
            }
          }
          return (
            <div>
              <form>
                <div className="row form-horizontal">
                  <h1>
                    Check-in between&nbsp;
                    {review.employee_name}
                    <br />
                    &nbsp;and supervisor&nbsp;
                    {review.reviewer_name}
                  </h1>
                  <a
                    className="pull-right"
                    style={{ fontSize: '20px', cursor: 'pointer' }}
                    onClick={() => this.handleOpenModal(submit)}
                  >
                    Printable Version
                  </a>
                  <div className="col-sm-12">
                    <div className="form-group" id="serverError" hidden>
                      <div className="alert alert-danger alert-sm">
                        <p>
                          There was an error processing your submission. Please contact&nbsp;
                          <a
                            href="mailto:Helpdesk@ashevillenc.gov"
                            target="_blank"
                            style={{
                              color: '#fff',
                              textDecoration: 'underline'
                            }}
                          >
                            help desk
                          </a>
                          &nbsp;and inform them of the time and date you tried to submit the form.
                        </p>
                        <p id="errorDetails">
                          ERROR
                        </p>
                      </div>
                    </div>
                    <div
                      className="form-group"
                      hidden={!(answersEditable || responsesEditable)}
                      style={{
                        position: 'fixed',
                        bottom: '2%',
                        right: '5%',
                        zIndex: '1',
                      }}
                    >
                      <div
                        className="alert alert-info alert-xs"
                        style={{
                          paddingBottom: '20px',
                          paddingLeft: '5px',
                        }}
                      >
                        <span
                          className="alert alert-info alert-xs"
                          style={{ padding: '3px' }}
                          data-type="saveSuccess"
                          id="saveSuccess1"
                          hidden
                        >
                          Progress successfully saved.
                        </span>
                        <button
                          className="btn btn-primary btn-xs pull-right"
                          style={{
                            position: 'relative',
                            top: '-10px',
                            right: '-10px',
                          }}
                          type="button"
                          id="plus"
                          onClick={() => {
                            document.getElementById(
                              'autosaveWarningText'
                            ).classList.toggle('show');
                            document.getElementById(
                              'plus'
                            ).classList.toggle('hidden');
                            document.getElementById('minus').classList.toggle('hidden');
                          }}
                        >
                          +
                        </button>
                        <button
                          className="btn btn-primary btn-xs hidden pull-right"
                          type="button"
                          id="minus"
                          style={{
                            position: 'relative',
                            top: '-10px',
                            right: '-10px',
                          }}
                          onClick={() => {
                            document.getElementById(
                              'autosaveWarningText'
                            ).classList.toggle('show');
                            document.getElementById(
                              'minus'
                            ).classList.toggle('hidden');
                            document.getElementById('plus').classList.toggle('hidden');
                          }}
                        >
                          -
                        </button>
                        <input
                          type="button"
                          value="Save your work"
                          className="btn btn-primary btn-xs pull-right"
                          onClick={() => this.handleSubmit(submit, true, 'saveSuccess1')}
                          style={{
                            position: 'relative',
                            top: '-10px',
                            right: '-2px',
                            marginBottom: '3px',
                          }}
                        />
                        <div className="collapse" id="autosaveWarningText">
                          <div className="card card-body">
                            Autosave has been implemented.
                            <br />
                            However you may still wish to save your progress frequently.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <fieldset className="reviewQuestionFieldset">
                        <legend>Check-in Details</legend>
                        <div className="col-sm-12" style={{ marginBottom: '10px' }}>
                          <label
                            htmlFor="startDate"
                            className="col-sm-4"
                            style={{ textAlign: 'right' }}
                          >
                            Previous check-in completed:
                          </label>
                          <div className={dateErrors.startDate ? 'col-sm-8 invalid' : 'col-xs-8'}>
                            <span>
                              {
                                (!periodStart
                                  || moment.utc(periodStart).format('M/DD/YYYY') === '1/01/1970')
                                  ? 'Never'
                                  : moment.utc(periodStart).format('M/DD/YYYY')
                              }
                            </span>
                          </div>
                        </div>
                        <div className={dateErrors.endDate ? 'col-sm-12 invalid' : 'col-sm-12'}>
                          <label
                            htmlFor="endDate"
                            className="col-sm-4"
                            style={{ textAlign: 'right' }}
                          >
                            Date of this check-in:&nbsp;
                          </label>
                          <div className="col-sm-8">
                            {answersEditable
                              && (
                                <DatePickerWrapper
                                  selected={moment.utc(periodEnd)}
                                  id="endDate"
                                  onChange={value => this.handleEndDateChange(value, submit)}
                                />
                              )
                            }
                            {answersEditable && dateErrors.endDate && (
                              <span
                                style={{
                                  color: 'red',
                                  fontWeight: 'bold',
                                  marginLeft: '10px',
                                }}
                              >
                                &apos;Date of this check-in&apos; is required
                              </span>
                            )
                            }
                            {!answersEditable && (
                              <span>{moment.utc(periodEnd).format('M/DD/YYYY')}</span>
                            )
                            }
                          </div>
                        </div>
                      </fieldset>
                    </div>
                    <CheckInInstructions />
                    <div className="form-group">
                      {
                        review.questions.map((question, index) => {
                          const resp = getResponse(question.id, review.responses);
                          return (
                            <div key={['question', index].join('_')}>
                              <Question
                                question={question}
                                editable={answersEditable}
                                onBlur={question.type === 'Text'
                                  ? (event => (this.handleTextEditorChange(event, submit)))
                                  : (value => (this.handleRadioQuestionChange(
                                    value, question.id, submit
                                  )))
                                }
                              />
                              {
                                resp !== null && (
                                  <Response response={resp} editable={responsesEditable} onChange={event => (this.handleTextEditorChange(event, submit))} />
                                )
                              }
                            </div>
                          );
                        })
                      }
                    </div>
                    <div className="form-group">
                      <Response
                        response={getMainReviewResponse(review.responses)}
                        standalone
                        editable={responsesEditable}
                        onChange={event => (this.handleTextEditorChange(event, submit))}
                      />
                    </div>
                    {review.status !== 'Closed' && role !== 'Viewer' && (
                      <div className="form-group">
                        <fieldset className="reviewQuestionFieldset">
                          <legend>Action</legend>
                          {role === 'Supervisor' && review.status === 'Open' && (
                            <div>
                              <p>
                                <i>
                                  Please discuss your feedback with your
                                   employee before submission for their input.
                                </i>
                              </p>
                              <RadioGroup
                                name="workflow"
                                selectedValue={actionRadio}
                                onChange={val => (this.setState({ actionRadio: val }))}
                              >
                                <label>
                                  <Radio value="saveprogress" />
                                  Save progress
                                </label>
                                <label>
                                  <Radio value="saveonly" />
                                  Save &amp; exit
                                </label>
                                <label>
                                  <Radio value="Ready" />
                                  Submit for employee input
                                </label>
                              </RadioGroup>
                              <div
                                className="alert alert-success alert-sm"
                                data-type="saveSuccess"
                                id="saveSuccess2"
                                hidden
                              >
                                <p>
                                  Your progress was saved.
                                </p>
                              </div>
                              <input
                                type="button"
                                className="btn btn-primary"
                                value="Save"
                                onClick={() => this.handleSubmit(submit)}
                              />
                              <span
                                id="formValidationError"
                                style={{
                                  color: 'red',
                                  marginLeft: '5px',
                                  display: 'none'
                                }}
                              >
                                Required fields are missing. You must supply a Date
                                 of check-in and fill in at least one section
                                  before you can submit this check-in for employee input.
                              </span>
                            </div>
                          )}
                          {role === 'Supervisor' && review.status === 'Acknowledged' && (
                            <div>
                              <RadioGroup
                                name="workflow"
                                selectedValue={actionRadio}
                                onChange={val => (this.setState({ actionRadio: val }))}
                              >
                                <label>
                                  <Radio value="Open" />
                                  Re-open
                                </label>
                                <label>
                                  <Radio value="Closed" />
                                  Submit to HR record
                                </label>
                              </RadioGroup>
                              <input
                                type="button"
                                className="btn btn-primary"
                                value="Save"
                                onClick={() => this.handleSubmit(submit)}
                              />
                            </div>
                          )}
                          {role === 'Supervisor' && review.status === 'Ready' && (
                            <div className="alert alert-info">
                              You must wait for your employee to respond
                               before further actions can be taken.
                            </div>
                          )}
                          {role === 'Employee' && review.status === 'Ready' && (
                            <div>
                              <p>
                                <i>
                                  By acknowledging, you affirm that you have read
                                   your supervisor&apos;s feedback and discussed
                                    it with your supervisor.
                                </i>
                              </p>
                              <RadioGroup
                                name="workflow"
                                selectedValue={actionRadio}
                                onChange={val => (this.setState({ actionRadio: val }))}
                              >
                                <label>
                                  <Radio value="saveprogress" />
                                  Save progress
                                </label>
                                <label>
                                  <Radio value="saveonly" />
                                  Save &amp; exit
                                </label>
                                <label>
                                  <Radio value="Acknowledged" />
                                  Acknowledge
                                </label>
                                <label>
                                  <Radio value="Open" />
                                  Further discussion requested
                                </label>
                              </RadioGroup>
                              <div
                                className="alert alert-success alert-sm"
                                data-type="saveSuccess"
                                id="saveSuccess2"
                                hidden
                              >
                                <p>
                                  Your progress was saved.
                                </p>
                              </div>
                              <input
                                type="button"
                                className="btn btn-primary"
                                value="Save"
                                onClick={() => this.handleSubmit(submit)}
                              />
                              <span
                                id="formValidationError"
                                style={{
                                  color: 'red',
                                  marginLeft: '5px',
                                  display: 'none'
                                }}
                              >
                                Required fields are missing. You must complete all
                                 required fields before you can submit your response
                                  to your supervisor.
                              </span>
                            </div>
                          )}
                          {role === 'Employee' && review.status === 'Open' && (
                            <div className="alert alert-info">
                              Your supervisor has not yet released their feedback for your response.
                            </div>
                          )}
                          {role === 'Employee' && review.status === 'Acknowledged' && (
                            <div className="alert alert-info">
                              You have acknowledged this check-in. When your supervisor
                               closes the check-in, it will appear in your HR record.
                            </div>
                          )}
                        </fieldset>
                      </div>
                    )}
                  </div>
                </div>
              </form>
              {role === 'Supervisor' && (
                <div>
                  <Link
                    style={{ fontSize: '20px' }}
                    to={{
                      pathname: '/',
                      search: `?emp=${review.employee_id}&mode=check-ins`,
                    }}
                  >
                    Back to&nbsp;
                    {review.employee_name}
                    &apos;s check-ins
                    <br />
                  </Link>
                  <Link
                    style={{ fontSize: '20px' }}
                    to={{
                      pathname: '/',
                      search: '?mode=employees',
                    }}
                  >
                    Back to all my employees
                  </Link>
                </div>
              )}
              {role === 'Employee' && (
                <Link
                  style={{ fontSize: '20px' }}
                  to={{
                    pathname: '/',
                    search: '?mode=check-ins',
                  }}
                >
                  Back to my check-ins
                </Link>
              )}
            </div>

          );
        }}
      </Mutation>
    );
  }
}

const questionShape = {
  id: PropTypes.number,
  type: PropTypes.string,
  question: PropTypes.string,
  answer: PropTypes.string,
  required: PropTypes.bool,
};

const responseShape = {
  question_id: PropTypes.number,
  review_id: PropTypes.number,
  Response: PropTypes.string,
};

const reviewShape = {
  id: PropTypes.number,
  status: PropTypes.string,
  status_date: PropTypes.string,
  supervisor_id: PropTypes.number,
  employee_id: PropTypes.number,
  position: PropTypes.string,
  periodStart: PropTypes.string,
  periodEnd: PropTypes.string,
  reviewer_name: PropTypes.string,
  employee_name: PropTypes.string,
  questions: PropTypes.arrayOf(PropTypes.shape(questionShape)),
  responses: PropTypes.arrayOf(PropTypes.shape(responseShape)),
};

Review.propTypes = {
  review: PropTypes.shape(reviewShape), // eslint-disable-line
};

export default withRouter(Review);
