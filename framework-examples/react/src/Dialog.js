import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Set as ImmutableSet } from "immutable";
import classNames from "classnames";
import createFocusTrap from "focus-trap";
import { MDCDialogFoundation } from "@material/dialog/dist/mdc.dialog";
import "@material/dialog/dist/mdc.dialog.css";

function createFocusTrapInstance(
  surfaceEl,
  acceptButtonEl,
  focusTrapFactory = createFocusTrap
) {
  return focusTrapFactory(surfaceEl, {
    initialFocus: acceptButtonEl,
    clickOutsideDeactivates: true
  });
}

class Dialog extends PureComponent {
  propTypes = {
    id: PropTypes.string,
    opened: PropTypes.bool,
    onAccept: PropTypes.func,
    onCancel: PropTypes.func,
    children: PropTypes.node
  };

  defaultProps = {
    opened: false,
    onAccept: () => {},
    onCancel: () => {}
  };

  state = {
    classes: new ImmutableSet()
  };

  // Here we initialize a foundation class, passing it an adapter which tells it how to
  // work with the React component in an idiomatic way.
  foundation = new MDCDialogFoundation({
    addClass: className =>
      this.setState(prevState => ({
        classes: prevState.classes.add(className)
      })),
    removeClass: className =>
      this.setState(prevState => ({
        classes: prevState.classes.remove(className)
      })),
    addBodyClass: className => document.body.classList.add(className),
    removeBodyClass: className => document.body.classList.remove(className),
    eventTargetHasClass: (target, className) =>
      this.state.classes.has(className),
    registerInteractionHandler: (evtType, handler) =>
      this.refs.root.addEventListener(evtType, handler),
    deregisterInteractionHandler: (evtType, handler) =>
      this.refs.root.removeEventListener(evtType, handler),
    registerSurfaceInteractionHandler: (evtType, handler) =>
      this.refs.dialogSurface.addEventListener(evtType, handler),
    deregisterSurfaceInteractionHandler: (evtType, handler) =>
      this.refs.dialogSurface.removeEventListener(evtType, handler),
    registerDocumentKeydownHandler: handler =>
      document.addEventListener("keydown", handler),
    deregisterDocumentKeydownHandler: handler =>
      document.removeEventListener("keydown", handler),
    registerTransitionEndHandler: handler =>
      this.refs.dialogSurface.addEventListener("transitionend", handler),
    deregisterTransitionEndHandler: handler =>
      this.refs.dialogSurface.removeEventListener("transitionend", handler),
    notifyAccept: () => {
      this.props.onAccept.bind(this);
    },
    notifyCancel: () => {
      this.props.onCancel.bind(this);
    },
    trapFocusOnSurface: () => this.focusTrap.activate(),
    untrapFocusOnSurface: () => this.focusTrap.deactivate(),
    isDialog: el => el === this.refs.dialogSurface
  });

  render() {
    const { id, children, onAccept, onCancel, className } = this.props;
    return (
      <aside
        ref="root"
        id={id}
        className={classNames(
          "mdc-dialog",
          ...this.state.classes.toJS(),
          className
        )}
        role="alertdialog"
      >
        <div ref="dialogSurface" className="mdc-dialog__surface">
          {children}
          <section className="mdc-dialog__body">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </section>
          <footer className="mdc-dialog__footer">
            <button
              ref="cancelButton"
              type="button"
              className="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel"
              onClick={onCancel}
            >
              Decline
            </button>
            <button
              ref="acceptButton"
              type="button"
              className="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept"
              onClick={onAccept}
            >
              Accept
            </button>
          </footer>
        </div>
        <div className="mdc-dialog__backdrop" />
      </aside>
    );
  }

  componentDidMount() {
    this.focusTrap = createFocusTrapInstance(
      this.refs.dialogSurface,
      this.refs.acceptButton
    );

    this.foundation.init();

    if (this.props.opened) {
      this.foundation.open();
    }
  }

  componentWillUnmount() {
    this.foundation.destroy();
  }

  componentWillReceiveProps(props) {
    if (props.opened !== this.props.opened) {
      this.setState({
        openedInternal: props.opened
      });

      if (props.opened) {
        this.foundation.open();
      } else {
        this.foundation.close();
      }
    }
  }
}

export default Dialog;
