/**
 * @flow
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getViewportSize } from '../common/window';
import { TOOLTIP_WIDTH, TOOLTIP_ARROW_SIZE } from '../common/constants';

class ImageTooltipContainer extends Component {
  _container = undefined;
  _eventsBinded = false;

  _handleMouseEnter = () => {
    const { tooltip } = this.props;
    const measurements = this._calculateTooltipPosition();

    if (
      tooltip &&
      measurements.top === tooltip.top &&
      measurements.left === tooltip.left
    ) {
      return;
    }

    this.props.dispatch({
      type: 'SET_TOOLTIP',
      tooltip: {
        ...measurements,
        content: this.props.src,
      },
    });
  };

  _handleMouseLeave = () => {
    if (!this.props.tooltip) {
      return;
    }

    this._clearTooltip();
  };

  _calculateTooltipPosition = () => {
    const rect = this._container.getBoundingClientRect();
    const pageRect = getViewportSize();

    let arrowDirection = 'SOUTH';
    let measurements = {
      top: rect.top + rect.height + TOOLTIP_ARROW_SIZE * 1.5,
      left: rect.left - TOOLTIP_WIDTH * 0.5 + rect.width * 0.5,
    };

    if (rect.top > pageRect.height * 0.55) {
      arrowDirection = 'NORTH';
      measurements = {
        top: rect.top - TOOLTIP_WIDTH - TOOLTIP_ARROW_SIZE * 1.5,
        left: rect.left - TOOLTIP_WIDTH * 0.5 + rect.width * 0.5,
      };
    }

    if (rect.left > pageRect.width * 0.66) {
      arrowDirection = 'WEST';
      measurements = {
        top: rect.top - TOOLTIP_WIDTH * 0.5 + rect.height * 0.5,
        left: rect.left - TOOLTIP_WIDTH - TOOLTIP_ARROW_SIZE * 1.5,
      };
    }

    if (rect.left < TOOLTIP_WIDTH) {
      arrowDirection = 'EAST';
      measurements = {
        top: rect.top - TOOLTIP_WIDTH * 0.5 + rect.height * 0.5,
        left: rect.left + rect.width + TOOLTIP_ARROW_SIZE * 1.5,
      };
    }

    return {
      ...measurements,
      arrowDirection,
    };
  };

  _clearTooltip = () => {
    this.props.dispatch({
      type: 'CLEAR_TOOLTIP',
      tooltip: undefined,
    });
  };

  render() {
    return (
      <span
        className="image-tooltip-container"
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
        ref={c => {
          this._container = c;
        }}>
        <style jsx global>{`
          .image-tooltip-container {
            display: inline-block;
            position: relative;
            padding: 4px;
            border-radius: 3px;
            border: 1px solid #dcdcdc;
            margin: 0 8px 8px 0;
            color: #acacac;
            cursor: pointer;
            user-select: none;
          }

          .image-tooltip-container:hover {
            color: #555555;
            border: 1px solid #999999;
          }

          .image-tooltip-container:hover > .image-tooltip-container-svg {
            stroke: #555555;
          }

          .image-tooltip-container-svg {
            stroke: #acacac;
            display: block;
          }

          .image-tooltip-container-count {
            font-family: 'office-code', monospace;
            font-size: 0.7rem;
            text-align: center;
            margin-bottom: -4px;
          }
        `}</style>
        <svg
          className="image-tooltip-container-svg"
          xmlns="http://www.w3.org/2000/svg"
          width="16px"
          height="16px"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <div className="image-tooltip-container-count">
          {this.props.count}
        </div>
      </span>
    );
  }
}

export default connect(state => {
  return { tooltip: state.tooltip };
})(ImageTooltipContainer);
