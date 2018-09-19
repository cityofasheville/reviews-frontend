import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class DatePickerWrapper extends React.Component {
  constructor(props) {
    super(props);
    let selected = moment(new Date(), 'M/DD/YYYY');
    if (props.selected) {
      selected = moment(props.selected, 'M/DD/YYYY');
    }
    this.state = {
      selected: moment(selected),
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    const { onChange } = this.props;
    this.setState({
      selected: date,
    });
    if (onChange !== undefined) {
      onChange(date);
    }
  }

  render() {
    const { handleChange, id, selected } = this.state;
    return (
      <DatePicker
        id={id}
        name={id}
        onChange={handleChange}
        selected={selected}
      />
    );
  }
}

export default DatePickerWrapper;
