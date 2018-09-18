/* **********************************************************************************************
  WARNING: DO NOT EDIT this file except from inside the react-starter-template repository. Changes made to this file inside child repos will NOT be reflected in the parent source template repository, and will generate code conflicts.
*********************************************************************************************** */
import React from 'react';
import { Link } from 'react-router-dom';
import config from 'app/config';
import AuthControl from 'template/AuthControl';
import { withLanguage } from 'template/LanguageContext';
import LangSwitcher from 'template/LangSwitcher';
import {
  IM_MENU3,
} from 'template/assets/iconConstants';
import Icon from 'template/shared/Icon';
import 'template/styles/components/Navbar.css';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };

    this.toggleOpen = this.toggleOpen.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.translateMenuItem = this.translateMenuItem.bind(this);
  }

  componentDidMount() {
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  toggleOpen(e) {
    e.preventDefault();
    const { open } = this.state;
    this.setState({ open: !open });
  }

  handleResize() {
    this.setState({ windowWidth: window.innerWidth });
  }

  translateMenuItem(defaultText) {
    const { language } = this.props;
    for (let i = 0; i < config.menu_items.length; i += 1) {
      if (config.menu_items[i].defaultText === defaultText) {
        for (let j = 0; j < config.menu_items[i].translations.length; j += 1) {
          if (config.menu_items[i].translations[j].language === language.language) {
            return config.menu_items[i].translations[j].text;
          }
        }
      }
    }
    return defaultText;
  }

  render() {
    const { windowWidth, open } = this.state;
    let position = { top: 0, right: 0 };
    if (config.langSwitcher) {
      position = { top: 0, right: 90 };
    }
    if (windowWidth > 600) {
      return (
        <div className="Navbar-container">
          {(config.menu_items.length > 0 || config.authControl)
            && (
              <nav
                className="Navbar-nav"
                style={position}
                aria-label="main-menu"
              >
                {/* <div id="skip">
                  <a href="#content">Skip to Main Content</a>
                </div> */}
                {
                  config.menu_items.map(item => (
                    item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        className={item.active ? 'active' : ''}
                        alt={this.translateMenuItem(item.defaultText)}
                        key={item.defaultText}
                      >
                        {item.icon ? <Icon path={item.icon} size={24} />
                          : this.translateMenuItem(item.defaultText)}
                      </a>
                    )
                      : (
                        <Link
                          to={item.href}
                          className={item.active ? 'active' : ''}
                          alt={this.translateMenuItem(item.defaultText)}
                          key={item.defaultText}
                        >
                          {item.icon ? <Icon path={item.icon} size={24} />
                            : this.translateMenuItem(item.defaultText)}
                        </Link>
                      )
                  ))
                }
                {config.authControl && <AuthControl />}
              </nav>
            )
          }
          {config.langSwitcher && <LangSwitcher />}
        </div>
      );
    }
    return (
      <div className="Navbar-container narrow">
        {config.langSwitcher && <LangSwitcher />}
        {(config.menu_items.length > 0 || config.authControl)
          && (
            <nav
              className={`Navbar-nav hamburger ${open ? 'open' : ''}`}
              style={position}
              aria-label="main-menu"
            >
              <button
                className="dropdown-toggle"
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls="menu"
                aria-label="Navigation"
                onClick={this.toggleOpen}
              >
                <Icon path={IM_MENU3} size={32} />
              </button>
              <ul className="dropdown-menu" id="menu" tabIndex="-1">
                {
                  config.menu_items.map(item => (
                    <li key={`${item.defaultText}`}>
                      {
                        item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            className={item.active ? 'active' : ''}
                            alt={this.translateMenuItem(item.defaultText)}
                            key={item.defaultText}
                          >
                            {item.icon ? <Icon path={item.icon} size={24} />
                              : this.translateMenuItem(item.defaultText)}
                          </a>
                        )
                          : (
                            <Link
                              to={item.href}
                              className={item.active ? 'active' : ''}
                              alt={this.translateMenuItem(item.defaultText)}
                            >
                              {item.icon ? <Icon path={item.icon} size={24} />
                                : this.translateMenuItem(item.defaultText)}
                            </Link>
                          )
                      }
                    </li>
                  ))
                }
                {config.authControl && <li><AuthControl /></li>}
              </ul>
            </nav>
          )}
      </div>
    );
  }
}

export default withLanguage(Navbar);
