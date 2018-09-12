import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import config from 'app/config';

const Error = props => (
  <div className="row">
    <div className="col-sm-12">
      <div className="alert alert-danger alert-sm">
        <p>
          There was an error.&nbsp;
          {config.hasFeedbackForm
            && (
              <span>
                You may report issues using&nbsp;
                <a
                  href={config.feedbackURL}
                  target="_blank"
                  style={{ color: '#fff', textDecoration: 'underline' }}
                >
                  this form
                </a>
                .
              </span>
            )
          }
        </p>
        <p>
          Time:&nbsp;
          {moment().format('M/DD/YYYY HH:mm:ss Z')}
          &nbsp;UTC
        </p>
        <p>
          <span>Error details:&nbsp;</span>{props.message}
        </p>
      </div>
    </div>
  </div>
);

Error.propTypes = {
  message: PropTypes.string,
};

Error.defaultProps = {
  message: 'Error message',
};

export default Error;
