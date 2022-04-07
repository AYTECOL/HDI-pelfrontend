import React from 'react';
import $ from 'jquery';

import './styles.scss';

const getTooltipTemplate = () =>
  '<div class="tooltip tooltip-help" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>';

const reloadTooltipHelp = () => {
  $('[data-toggle="tooltip-help"]').tooltip({
    template: getTooltipTemplate(),
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
  const {
    placement,
    component: Component = 'div',
    title,
    children,
    ...rest
  } = props;
  React.useEffect(() => {
    reloadTooltipHelp();
  }, []);
  return (
    <Component
      {...rest}
      data-toggle="tooltip-help"
      data-placement={placement}
      title={title}
    >
      {children}
    </Component>
  );
};
