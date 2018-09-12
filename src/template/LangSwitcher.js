import React from 'react';
import config from 'app/config';
import { withLanguage } from 'template/LanguageContext';
import 'template/styles/components/LangSwitcher.css';

const LangSwitcher = props => (
  <div className="LangSwitcher-dropdown">
    <select onChange={(e) => {
      let language;
      let label;
      [language, label] = e.target.value.split(':');
      props.language.switchLanguage(
        language,
        label,
        false,
      );
    }}
    >
      {
        config.languages.map(lang => (
          <option key={lang.language} value={`${lang.language}:${lang.label}`}>{lang.label}</option>
        ))}
    </select>
  </div>
);

export default withLanguage(LangSwitcher);
