import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import queryString from 'query-string';
import Review from 'app/Review';
import PrintableReview from 'app/PrintableReview';
import LoadingAnimation from 'template/shared/LoadingAnimation';
import Error from 'template/shared/Error';

const GET_REVIEW = gql`
    query reviewQuery($id: Int, $employee_id: Int) {
        employee {
            id
            supervisor_id
        }
        review (id: $id, employee_id: $employee_id) {
            id
            status
            status_date
            supervisor_id
            employee_id
            position
            previousReviewDate
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

const GET_LAST_REVIEWED = gql`
    query lastReviewed($id: Int) {
        employee (id: $id) {
            last_reviewed
            supervisor_id
        }
    }
`;

const ReviewContainer = ({ location }) => {
  let fetched = false;
  const search = queryString.parse(location.search); //TODO: This is not parsing the query string correctly
  let { emp, printable } = search;
  let id = search['check-in'] || -1;

  return (
    <Query
      query={GET_REVIEW}
      variables={{
        id: 11070,
        employee_id: 8350,
      }}
      fetchPolicy="network-only"
      skip={fetched}
    >
      {({ loading, error, data }) => {
        if (loading) return <LoadingAnimation />;
        if (error) return <Error message={error.message} />;
        const loggedInEmployee = data.employee;
        const { review } = data;

        return (
          <Query
            query={GET_LAST_REVIEWED}
            variables={{
              id: 8350,
            }}
            skip={fetched}
          >
            {({ loading, error, data }) => {
              if (loading) return <LoadingAnimation />;
              if (error) return <Error message={error.message} />;
              fetched = true;
              const { employee } = data;
              const lastReviewed = employee.last_reviewed;
              const currSupervisor = data.employee.supervisor_id;
              if (printable !== 'yes') {
                return (
                  <Review
                    review={review}
                    userId={loggedInEmployee.id}
                    printable={printable === 'yes'}
                    lastReviewed={lastReviewed}
                    currentSupervisor={currSupervisor}
                    location={location}
                  />
                );
              }
              return (
                <PrintableReview
                  review={review}
                  userId={loggedInEmployee.id}
                  lastReviewed={lastReviewed}
                  currentSupervisor={currSupervisor}
                />
              );
            }}
          </Query>
        );
      }}
    </Query>
  );
};

export default ReviewContainer;
