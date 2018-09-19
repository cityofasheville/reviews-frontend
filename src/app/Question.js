import React from 'react';
import { RadioGroup, Radio } from 'react-radio-group';
import PropTypes from 'prop-types';
import RichTextEditor from 'app/RichTextEditor';

const markup = stringValue => (
  { __html: stringValue }
);

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = { answer: props.question.answer };
    this.updateYNAnswer = this.updateYNAnswer.bind(this);
  }

  updateYNAnswer(newAnswer) {
    const { onBlur } = this.props;
    this.setState({
      answer: newAnswer,
    });
    if (onBlur !== undefined) {
      onBlur(newAnswer);
    }
  }

  render() {
    const {
      editable,
      question,
      invalid,
      onBlur,
      required,
      requiredText,
    } = this.props;
    const {
      answer,
    } = this.state;
    return (
      <fieldset className="reviewQuestionFieldset">
        <div
          dangerouslySetInnerHTML={markup(question.question)} // eslint-disable-line react/no-danger
        />
        <h3>Supervisor</h3>
        {question.type === 'Text' && editable && (
          <RichTextEditor
            id={['qanswer', question.id].join('-')}
            content={question.answer}
            editable={editable}
            invalid={invalid}
            onChange={onBlur}
          />
        )}
        {question.type === 'Text' && !editable && (
          <div style={{ border: '1px solid #e5e5e5', padding: '10px' }}>
            <div
              dangerouslySetInnerHTML={{ __html: question.answer }} // eslint-disable-line react/no-danger
            />
          </div>
        )}
        {question.type === 'Y/N' && (
          <div style={invalid ? { backgroundColor: '#ffe2e2' } : {}}>
            <div style={{ display: 'inline-block' }}>
              <RadioGroup
                name={['ynanswer', question.id].join('-')}
                selectedValue={answer}
                onChange={this.updateYNAnswer}
                disabled={!editable}
              >
                <label>
                  <Radio value="1" disabled={!editable} />
                  Yes
                </label>
                <label>
                  <Radio value="0" disabled={!editable} />
                  No
                </label>
              </RadioGroup>
            </div>
            <span style={{ marginLeft: '10px' }}>
              {editable && (
                <a onClick={() => this.updateYNAnswer('')}>Clear</a>
              )}
            </span>
          </div>
        )}
        {required && requiredText.length !== 0 && (
          <div style={{ fontStyle: 'italic', marginTop: '5px' }}>
            <span style={invalid ? { color: 'red' } : {}}>
              {requiredText}
            </span>
          </div>
        )
        }
      </fieldset>
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
Question.propTypes = {
  invalid: PropTypes.bool,
  question: PropTypes.shape(questionShape),
  editable: PropTypes.bool,
  requiredText: PropTypes.string,
  onBlur: PropTypes.func,
};
Question.defaultProps = {
  editable: true,
  required: true,
  requiredText: '',
  invalid: false,
  onBlur: undefined,
};
export default Question;
