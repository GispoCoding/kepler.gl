// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useCallback, useMemo} from 'react';
import ItemSelector from '../common/item-selector/item-selector';
import {PanelLabel} from '../common/styled-components';
import {FormattedMessage} from 'react-intl';
import TimeRangeSliderFactory from 'components/common/time-range-slider';
import moment from 'moment';

ArrayFilterFactory.deps = [TimeRangeSliderFactory];
const defaultTimeRange = [
  moment
    .utc()
    .startOf('day')
    .unix() * 1000,
  (moment
    .utc()
    .startOf('day')
    .unix() +
    2 * 60 * 60) *
    1000
];

const timeDomain = [
  moment
    .utc()
    .startOf('day')
    .unix() * 1000,
  (moment
    .utc()
    .endOf('day')
    .unix() +
    1) *
    1000
];

export default function ArrayFilterFactory(TimeRangeSlider) {
  return React.memo(({idx, filter, setFilter, isAnimatable, toggleAnimation, hideTimeTitle}) => {
    const labeledDomainValues = useMemo(
      () =>
        filter.domain.reduce(
          (acc, current) => ({
            ...acc,
            [current.split(':')[0]]: `${current.split(':')[0]}:${current.split(':')[1]}`
          }),
          {}
        ),
      [filter.domain]
    );
    const currentValue = useMemo(
      () =>
        filter.value && Object.prototype.toString.call(filter.value) === '[object String]'
          ? filter.value.split(':')[0]
          : filter.value,
      [filter.value]
    );

    const onSetFilter = useCallback(value => setFilter(idx, 'value', labeledDomainValues[value]), [
      idx,
      setFilter,
      labeledDomainValues
    ]);

    const onSetTimeFilter = useCallback(
      value => {
        setFilter(idx, 'timeRange', value);
        setFilter(idx, 'value', `${filter.value}:${value}`);
      },
      [idx, setFilter, filter.value]
    );

    const currentTimeValue = useMemo(
      () => (filter.timeRange ? filter.timeRange : defaultTimeRange),
      [filter.timeRange, defaultTimeRange]
    );

    //  TODO: show animation slider AND improve performance
    return (
      <div>
        <PanelLabel htmlFor={`filter-${filter.id}`}>
          <FormattedMessage id={'misc.valuesIn'} />
        </PanelLabel>
        <ItemSelector
          options={Object.keys(labeledDomainValues)}
          selectedItems={currentValue}
          onChange={onSetFilter}
          multiSelect={false}
        />
        {filter.type && currentValue && currentValue.length > 0 && !filter.enlarged && (
          <TimeRangeSlider
            domain={timeDomain}
            value={currentTimeValue}
            plotType={filter.plotType}
            lineChart={filter.lineChart}
            step={1000 * 60 * 60 * 2}
            // speed={filter.speed}
            speed={1}
            histogram={filter.enlarged ? filter.enlargedHistogram : filter.histogram}
            onChange={onSetTimeFilter}
            toggleAnimation={toggleAnimation}
            isAnimatable={isAnimatable}
            isEnlarged={filter.enlarged}
            hideTimeTitle={hideTimeTitle}
          />
        )}
      </div>
    );
  });
}
