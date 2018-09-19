import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import {
  IM_WARNING2,
  IM_HOURGLASS,
} from 'template/assets/iconConstants';
import LoadingAnimation from 'template/shared/LoadingAnimation';
import Error from 'template/shared/Error';
import Icon from 'template/shared/Icon';

const getTimeSinceLastConversation = (reviewDate, reviewable) => {
  if (!reviewable) {
    return <span>--</span>;
  }
  const lastReviewedDate = reviewDate ? moment.utc(reviewDate).format('M/DD/YYYY') : null;
  if (!lastReviewedDate) {
    return <span style={{ color: 'orange' }}>Never</span>;
  }
  const today = moment.utc(new Date(), 'M/DD/YYYY');
  const daysSinceLastReview = today.diff(moment.utc(lastReviewedDate, 'M/DD/YYYY'), 'days');
  if (daysSinceLastReview > 60) {
    return (
      <span
        style={{ color: 'red' }}
      >
        {daysSinceLastReview}
        &nbsp;days&nbsp;
        <Icon path={IM_WARNING2} size={18} />
      </span>
    );
  }
  if (daysSinceLastReview > 51) {
    return (
      <span
        style={{ color: 'orange' }}
      >
        {daysSinceLastReview}
        &nbsp;days&nbsp;
        <Icon path={IM_HOURGLASS} size={18} />
      </span>
    );
  }
  return (
    <span>
      {daysSinceLastReview}
      &nbsp;days
    </span>
  );
};

const dataColumnsCurrent = [
  {
    Header: (<div>Check-in Date</div>),
    id: 'periodEnd',
    accessor: review => (
      <span
        title="View check-in"
      >
        {moment.utc(review.periodEnd).format('M/DD/YYYY')}
      </span>),
    minWidth: 160,
    Cell: row => (
      <Link
        to={{
          pathname: '/check-in',
          search: `?emp=${row.original.employee_id}&check-in=${row.original.id}`
        }}
      >
        {row.value}
      </Link>
    ),
  },
  {
    Header: 'Status',
    id: 'status',
    accessor: (review) => {
      switch (review.status) {
        case 'Open':
          return <span>Waiting for supervisor comments</span>;
        case 'Ready':
          return <span>Waiting for employee acknowledgement</span>;
        case 'Acknowledged':
          return <span>Waiting for supervisor to finalize</span>;
        case 'Closed':
          return <span>Completed</span>;
        default:
          return <span></span>;
      }
    },
    minWidth: 300,
  },
  {
    Header: 'Last Change',
    id: 'status_date',
    accessor: review => (<span>{moment.utc(review.status_date).format('M/DD/YYYY')}</span>),
    maxWidth: 200,
    minWidth: 130,
  },
];

const dataColumns = [
  {
    Header: (<div>Check-in Date</div>),
    id: 'periodEnd',
    accessor: review => (
      <span
        title="View check-in"
      >
        {moment.utc(review.periodEnd).format('M/DD/YYYY')}
      </span>),
    minWidth: 200,
    Cell: row => (
      <Link
        to={{
          pathname: '/check-in',
          search: `?emp=${row.original.employee_id}&check-in=${row.original.id}`
        }}
      >
        {row.value}
      </Link>
    ),
  },
  {
    Header: 'Supervisor',
    accessor: 'reviewer_name',
    minWidth: 300,
  },
];

const GET_LOGGED_IN_EMPLOYEE = gql`
  query employee {
    employee {
      id
      name
    }
  }
`;

const ReviewsTable = ({
  reviews,
  current,
  lastReviewed,
  reviewable,
  emp,
  supervisorId,
}) => (
  <Query
    query={GET_LOGGED_IN_EMPLOYEE}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      const loggedInEmpId = data.employee.id;
      return (
        <div className="row">
          <div className="col-sm-12">
            <h2>
              {current ? 'Current Check-in' : 'Past Check-ins'}
              {current
                && (
                  <span
                    style={{
                      fontSize: '16px',
                      marginLeft: '15px',
                      fontStyle: 'italic',
                    }}
                  >
                    Time since last check-in:&nbsp;
                    {
                      getTimeSinceLastConversation(
                        lastReviewed,
                        reviewable
                      )
                    }
                  </span>)
              }
            </h2>
            {reviews.length === 0 && (
              <div className="alert alert-warning">
                <span
                  className="alert-text"
                >
                  {
                    current ? 'No current check-in found' : 'No past check-ins found'
                  }
                </span>
                {current && reviewable && (supervisorId === loggedInEmpId) && (
                  <Link
                    to={{
                      pathname: '/check-in',
                      search: `?emp=${emp}`,
                    }}
                  >
                    <div
                      className="btn btn-primary btn-sm"
                      style={{ marginLeft: '10px' }}
                    >
                      Begin a check-in
                    </div>
                  </Link>
                )}
              </div>
            )
            }
            {reviews.length > 0 && (
              <div
                alt={current ? 'Table displaying current check-in'
                  : 'Table of past check-ins'
                }
                style={{ marginTop: '10px' }}
              >
                <ReactTable
                  data={reviews}
                  columns={current ? dataColumnsCurrent : dataColumns}
                  pageSize={reviews.length < 20 ? reviews.length : 20}
                  showPagination={reviews.length >= 20}
                />
              </div>
            )}
          </div>
        </div>
      );
    }}
  </Query>
);

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

ReviewsTable.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape(reviewShape)),
  current: PropTypes.bool,
};

ReviewsTable.defaultProps = {
  current: false,
  reviews: [],
};

export default ReviewsTable;
