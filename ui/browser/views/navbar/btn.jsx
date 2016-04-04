
import React, { PropTypes } from 'react';

/**
 * A button for the NavBar.
 * `icon` must be a valid font-awesome icon name
 */
const Btn = ({ disabled, title, icon, onClick }) => (
  <a href="#" className={disabled ? 'disabled' : ''} {...{ title, onClick }}>
    <i className={`fa fa-${icon}`} />
  </a>
);

Btn.propTypes = {
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Btn;
