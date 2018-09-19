import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';

const getResponse = (questionId, responses) => {
  // assumes 1:1 relationship between a question and a response
  for (const response of responses) {
    if (questionId === response.question_id) {
      return response;
    }
  }
  return null;
};

// will main response have question_id as -1?
// will it exist always or do we need to return an empty obj here
const getMainReviewResponse = (responses) => {
  for (const response of responses) {
    if (response.question_id === -1) {
      return response;
    }
  }
  return null;
}

const PrintableReview = ({ review, lastReviewed, userId }) => {
  const periodStart = review.status === 'Closed'
    ? review.previousReviewDate
    : lastReviewed;

  return (
    <div>
      <div className="row form-horizontal">
        <h1>
          Check-in between&nbsp;
          {review.employee_name}
          <br />
          &nbsp;and supervisor&nbsp;
          {review.reviewer_name}
        </h1>
        <Link
          className="pull-right"
          style={{ fontSize: '20px' }}
          to={{
            pathname: '/check-in',
            search: `?emp=${review.employee_id}&check-in=${review.id}&printable=no`,
          }}
        >
          Back to check-in
        </Link>
        <div className="col-sm-12">
          <div className="form-group">
            <fieldset className="reviewQuestionFieldset">
              <legend>Check-in Details</legend>
              <div className="col-sm-12" style={{ marginBottom: '10px' }}>
                <label
                  htmlFor="startDate"
                  className="col-sm-4"
                  style={{ textAlign: 'right' }}
                >
                  Previous check-in completed:&nbsp;
                </label>
                <div className="col-sm-8">
                  <span>
                    {
                      (!periodStart || moment.utc(periodStart).format('M/DD/YYYY') === '1/01/1970')
                        ? 'Never'
                        : moment.utc(periodStart).format('M/DD/YYYY')
                    }
                  </span>
                </div>
              </div>
              <div className="col-sm-12">
                <label
                  htmlFor="endDate"
                  className="col-sm-4"
                  style={{ textAlign: 'right' }}
                >
                  Date of this check-in:&nbsp;
                </label>
                <div className="col-sm-8">
                  <span>
                    {moment.utc(review.periodEnd).format('M/DD/YYYY')}
                  </span>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="form-group">
            {review.questions.map((question, index) => (
              <div key={['question', index].join('_')}>
                <fieldset className="reviewQuestionFieldset">
                  <div
                    dangerouslySetInnerHTML={{ __html: question.question }} // eslint-disable-line react/no-danger
                  />
                  <div style={{ border: '1px solid #e5e5e5', padding: '10px' }}>
                    <div
                      dangerouslySetInnerHTML={{ __html: question.answer }} // eslint-disable-line react/no-danger
                    />
                  </div>
                </fieldset>
                {getResponse(question.id, review.responses) !== null && (
                  <div style={{ marginBottom: '25px'}}>
                    <h3>Employee Response</h3>
                    <div style={{ border: '1px solid #e5e5e5', padding: '10px' }}>
                      <div
                        dangerouslySetInnerHTML={{ __html: getResponse(question.id, review.responses).Response }} // eslint-disable-line react/no-danger
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="form-group">
            <fieldset className="reviewQuestionFieldset">
              <legend>Employee Comments</legend>
              <div style={{ border: '1px solid #e5e5e5', padding: '10px' }}>
                {getMainReviewResponse(review.responses) !== null && (
                  <div
                    dangerouslySetInnerHTML={{ __html: getMainReviewResponse(review.responses).Response }} // eslint-disable-line react/no-danger
                  />
                )}
              </div>
              {review.status !== 'Closed' && (
                <div style={{ marginTop: '25px', marginBottom: '25px' }}>
                  <strong>NOTE:</strong>
                  &nbsp;This check-in has not yet been closed,
                   therefore this printout may not reflect
                    the final version of this check-in.
                </div>
              )}
            </fieldset>
          </div>
          {review.employee_id === userId && (
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
          {userId === review.supervisor_id && (
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
        </div>
      </div>
    </div>
  );
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
  previousReviewDate: PropTypes.string,
  periodStart: PropTypes.string,
  periodEnd: PropTypes.string,
  reviewer_name: PropTypes.string,
  employee_name: PropTypes.string,
  questions: PropTypes.arrayOf(PropTypes.shape(questionShape)),
  responses: PropTypes.arrayOf(PropTypes.shape(responseShape)),
};

PrintableReview.propTypes = {
  review: PropTypes.shape(reviewShape), // eslint-disable-line
};

export default PrintableReview;
