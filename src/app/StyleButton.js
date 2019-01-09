import React from 'react';

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    const { active, label, styleClass, title } = this.props;
    let className = 'RichEditor-styleButton';
    if (active) {
      className += ' RichEditor-activeButton';
    }
    className += ` ${styleClass}`;
    return (
      <span className={className} onMouseDown={this.onToggle} title={title}>
        {label}
      </span>
    );
  }
}

export default StyleButton;
