import React from "react";
import PropTypes from "prop-types";

const DialogHeader = props => {
  const { id, children } = props;
  return (
    <header id={id} className="mdc-dialog__header">
      {children}
    </header>
  );
};

DialogHeader.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node
};

export default DialogHeader;
