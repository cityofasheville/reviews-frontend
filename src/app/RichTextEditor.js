import React from 'react';
import TinyMCE from 'react-tinymce';
import PropTypes from 'prop-types';

// https://github.com/instructure-react/react-tinymce/issues/35

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  componentDidMount() {
    const { id } = this.props;
    this.textAreaElement = document.getElementById(id);
    this.textAreaElement.name = id;
  }

  handleEditorChange(e) {
    const { onChange } = this.props;
    onChange(e);
  }

  render() {
    const {
      id,
      invalid,
      content,
      editable,
    } = this.props;
    return (
      <TinyMCE
        id={id}
        key={content}
        content={content}
        config={{
          plugins: 'link image code lists',
          toolbar: 'undo redo  | bold italic underline strikethrough| alignleft aligncenter alignright | numlist bullist | indent outdent | code', // eslint-disable-line max-len
          menubar: 'edit insert format',
          menu: {
            edit: {
              title: 'Edit',
              items: 'undo redo | cut copy paste pastetext | selectall',
            },
            format: {
              title: 'Format',
              items: 'bold italic underline strikethrough superscript subscript | formats | removeformat', // eslint-disable-line max-len
            },
            insert: {
              title: 'Insert',
              items: 'link',
            },
            tools: {
              title: 'Tools',
              items: 'spellchecker code',
            },
          },
          branding: false,
          readonly: !editable,
          content_style: editable // eslint-disable-line no-nested-ternary
            ? 'body { background-color: rgb(248, 248, 248) !important; }* { cursor: not-allowed }'
            : (
              invalid
                ? '.mce-content-body { background-color: #ffe2e2 !important }'
                : 'body { background: #fff }'),
          browser_spellcheck: true,
          height: 250,
        }}
        onKeyup={this.handleEditorChange}
        onBlur={this.handleEditorChange}
      />
    );
  }
}

RichTextEditor.propTypes = {
  content: PropTypes.string,
  editable: PropTypes.bool,
  id: PropTypes.string.isRequired,
  invalid: PropTypes.bool,
  onChange: PropTypes.func,
};

RichTextEditor.defaultProps = {
  content: '',
  editable: true,
  invalid: false,
  onChange: null,
};

export default RichTextEditor;
