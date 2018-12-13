import React from 'react';
import StyleButton from './StyleButton';

const INLINE_STYLES = [
  { label: 'B', style: 'BOLD', class: 'bold' },
  { label: 'I', style: 'ITALIC', class: 'italic' },
  { label: 'U', style: 'UNDERLINE', class: 'underline' },
];

const InlineStyleControls = (props) => {
  const { editorState } = props;
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          styleClass={type.class}
        />
      ))}
    </div>
  );
};

export default InlineStyleControls;
