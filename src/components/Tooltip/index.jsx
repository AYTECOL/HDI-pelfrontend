import React from 'react';
import $ from 'jquery';

import './styles.scss';

const getTooltipTemplate = (wide) =>
  `<div class="tooltip tooltip-help" role="tooltip"><div class="arrow"></div><div class="tooltip-inner ${
    wide ? 'wide' : ''
  }"></div></div>`;

const reloadTooltipHelp = (element, { title, placement}, wide) => {
  return $(element).tooltip({
    template: getTooltipTemplate(wide),
    title,
    placement,
  });
};

/**
 *
 * @param {{
 *  title: string;
 *  placement: 'top'| 'bottom'| 'left'| 'right';
 *  component?: any;
 *  children?: React.ReactNode
 * } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>} props
 */
export const Tooltip = (props) => {
  const elementRef = React.useRef(null);
  const {
    placement,
    component: Component = 'div',
    title,
    children,
    wide = false,
    ...rest
  } = props;
  React.useEffect(() => {
    const tooltip = reloadTooltipHelp(
      elementRef.current,
      {
        title,
        placement,
      },
      wide
    );
    return () => {
      tooltip.tooltip('dispose');
    };
  }, [title, placement, wide]);
  return (
    <Component {...rest} data-toggle="tooltip-help" ref={elementRef}>
      {children}
    </Component>
  );
};
