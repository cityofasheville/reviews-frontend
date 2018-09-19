import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'app/RichTextEditor';

class Response extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(newResponse) {
    const { onChange } = this.props; // weird to name the same thing...
    if (onChange !== undefined) {
      onChange(newResponse);
    }
  }

  render() {
    const {
      editable,
      invalid,
      response,
      standalone,
      onChange,
      required,
      requiredText
    } = this.props;
    if (response === null) return null;
    if (standalone) {
      return (
        <fieldset className="reviewQuestionFieldset">
          <legend>Employee Comments</legend>
          { editable ? (
            <RichTextEditor
              id={['response', response.question_id].join('-')}
              content={response.Response}
              editable={editable}
              invalid={invalid}
              onChange={onChange}
            />
          ) : (
            <div style={{ border: '1px solid #e5e5e5', padding: '10px' }}>
              <div
                dangerouslySetInnerHTML={{ __html: response.Response }} // eslint-disable-line react/no-danger
              />
            </div>
          )
          }
          {required && requiredText.length !== 0 && (
            <div style={{ fontStyle: 'italic', marginTop: '5px' }}>
              <span style={invalid ? { color: 'red' } : {}}>{requiredText}</span>
            </div>
          )}
        </fieldset>
      );
    }
    return (
      <div style={{ marginBottom: '25px' }}>
        <h3>Employee</h3>
        { editable ? (
          <RichTextEditor
            id={['response', response.question_id].join('-')}
            content={response.Response}
            editable={editable}
            invalid={invalid}
            onChange={onChange}
          />
        ) : (
          <div style={{ border: '1px solid #e5e5e5', padding: '10px' }}>
            <div
              dangerouslySetInnerHTML={{ __html: response.Response }} // eslint-disable-line react/no-danger
            />
          </div>
        )

        }
        {required && requiredText.length !== 0 && (
          <div style={{ fontStyle: 'italic', marginTop: '5px' }}>
            <span style={invalid ? { color: 'red' } : {}}>
              {requiredText}
            </span>
          </div>
        )}
      </div>
    );
  }
};

const responseShape = {
  question_id: PropTypes.number,
  review_id: PropTypes.number,
  Response: PropTypes.string,
};

Response.propTypes = {
  response: PropTypes.shape(responseShape),
  editable: PropTypes.bool,
  required: PropTypes.bool,
  requiredText: PropTypes.string,
  onChange: PropTypes.func,
  invalid: PropTypes.bool,
  standalone: PropTypes.bool,
};

Response.defaultProps = {
  editable: false,
  required: true,
  requiredText: '',
  standalone: false,
  invalid: false,
  onChange: undefined,
};

export default Response;
