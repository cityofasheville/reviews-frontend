import React from 'react';
import gql from 'graphql-tag';
import queryString from 'query-string';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { RadioGroup, Radio } from 'react-radio-group';
import Employees from 'app/Employees';
import Reviews from 'app/Reviews';
import LoadingAnimation from 'template/shared/LoadingAnimation';
import Error from 'template/shared/Error';

const GET_EMPLOYEE = gql`
  query employee($id: Int) {
    employee (id: $id) {
      id
      name
      employees {
        id
      }
    }
  }
`;

const EmployeeHome = (props) => {
  const { location } = props;
  console.log(props);
  return (
    <Query
      query={GET_EMPLOYEE}
      variables={{
        id: queryString.parse(location.search).emp,
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return <LoadingAnimation />;
        if (error) return <Error message={error.message} />;
        const { history } = props;
        const queryParams = queryString.parse(location.search);
        const isSupervisor = () => (
          data.employee.employees.length > 0
        );

        const refreshLocation = (value) => {
          let paramsString = ['?mode=', value].join('');
          if (queryParams.emp) {
            paramsString = [paramsString, '&emp=', queryParams.emp].join('');
          }
          history.push([location.pathname, paramsString].join(''));
        };

        const displayContents = () => {
          if (isSupervisor()) {
            if (queryParams.mode) {
              if (queryParams.mode === 'employees') {
                return <Employees {...props} userId={data.employee.id} />;
              }
              return <Reviews {...props} />;
            }
            if (queryParams.emp) {
              return <Reviews {...props} />;
            }
            return <Employees {...props} userId={data.employee.id} />;
          }
          return <Reviews {...props} />;
        };

        return (
          <div className="row">
            <div className="col-sm-12">
              {isSupervisor()
                && (
                  <RadioGroup
                    name="modeRadio"
                    selectedValue={queryParams.mode ||
                      (queryParams.emp ? 'check-ins' : 'employees')
                    }
                    onChange={refreshLocation}
                  >
                    <label>
                      <Radio
                        value="employees"
                      />
                      {queryParams.emp ? [data.employee.name, '\'s'].join('') : 'My'}
                      &nbsp;employees
                    </label>
                    <label>
                      <Radio
                        value="check-ins"
                      />
                      {queryParams.emp ? [data.employee.name, '\'s'].join('') : 'My'}
                      &nbsp;check-ins
                    </label>
                  </RadioGroup>
                )
              }
              {displayContents()}
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(EmployeeHome);
