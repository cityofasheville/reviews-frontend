import React from 'react';
import StyleButton from 'app/StyleButton';
import Icon from 'template/shared/Icon';
import {
  IM_LIST2,
  IM_LIST_NUMBERED,
} from 'template/assets/iconConstants';

const BLOCK_TYPES = [
  // { label: 'H1', style: 'header-one' },
  // { label: 'H2', style: 'header-two' },
  // { label: 'H3', style: 'header-three' },
  // { label: 'H4', style: 'header-four' },
  // { label: 'H5', style: 'header-five' },
  // { label: 'H6', style: 'header-six' },
  {
    label: <Icon path={IM_LIST2} size={14} />,
    style: 'unordered-list-item',
    class: 'bullet-list',
    title: 'Bullet list',
  },
  {
    label: <Icon path={IM_LIST_NUMBERED} size={14} />,
    style: 'ordered-list-item',
    class: 'numbered-list',
    title: 'Numbered list',
  },
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          styleClass={type.class}
          title={type.title}
        />
      ))}
    </div>
  );
};

export default BlockStyleControls;
