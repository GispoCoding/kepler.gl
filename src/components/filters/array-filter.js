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

import React, {useCallback, useMemo, useState} from 'react';
import ItemSelector from '../common/item-selector/item-selector';
import TimeRangeSliderFactory from 'components/common/time-range-slider';
import moment from 'moment';
import Switch from '../common/switch';

ArrayFilterFactory.deps = [TimeRangeSliderFactory];
const defaultTimeRange = [
  (moment
    .utc()
    .startOf('day')
    .unix() +
    8 * 60 * 60) *
    1000,
  (moment
    .utc()
    .startOf('day')
    .unix() +
    10 * 60 * 60) *
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

    const [previousVal, setPreviousVal] = useState('Helsinki');

    const isEmpty = value => value == null || value.length === 0;

    const onSetFilter = useCallback(
      value => {
        setPreviousVal(value);
        setFilter(idx, 'value', labeledDomainValues[value]);
      },
      [idx, setFilter, labeledDomainValues, setPreviousVal, previousVal]
    );

    const currentValue = useMemo(() => {
      let newVar =
        Object.prototype.toString.call(filter.value) === '[object String]'
          ? filter.value.split(':')[0]
          : filter.value;
      if (isEmpty(newVar)) {
        newVar = previousVal;
        onSetFilter(previousVal);
      }
      return newVar;
    }, [filter.value, previousVal]);

    const setValueAfterTimeFilter = value => {
      const vals = filter.value.split(':');
      const newVal =
        vals.length === 2 ? `${filter.value}:${value}` : `${vals[0]}:${vals[1]}:${value}`;
      setFilter(idx, 'value', newVal);
    };

    const onSetTimeFilter = useCallback(
      value => {
        setFilter(idx, 'timeRange', value);
        setValueAfterTimeFilter(value);
      },
      [idx, setFilter, filter.value]
    );

    const currentTimeValue = useMemo(() => (filter.timeRange ? filter.timeRange : timeDomain), [
      filter.timeRange,
      timeDomain
    ]);

    const isTimeRangeWholeDay = useMemo(() => currentTimeValue === timeDomain, [
      currentTimeValue,
      timeDomain
    ]);

    const onToggleWholeDaySwitch = useCallback(
      e => {
        const timeRangeVal = isTimeRangeWholeDay ? defaultTimeRange : timeDomain;
        setFilter(idx, 'timeRange', timeRangeVal);
        setValueAfterTimeFilter(timeRangeVal);
      },
      [isTimeRangeWholeDay, defaultTimeRange, timeDomain, setFilter, previousVal, currentValue]
    );

    return (
      <div>
        <ItemSelector
          options={Object.keys(labeledDomainValues)}
          selectedItems={currentValue}
          onChange={onSetFilter}
          multiSelect={false}
          placement={filter.enlarged ? 'top' : 'bottom'}
        />

        {filter.type && currentValue && currentValue.length > 0 && (
          <div>
            <Switch
              type="switch"
              id="show-whole-day"
              checked={isTimeRangeWholeDay}
              label={'Näytä koko vuorokausi'}
              onChange={onToggleWholeDaySwitch}
            />
            <TimeRangeSlider
              domain={timeDomain}
              value={currentTimeValue}
              plotType={filter.plotType}
              lineChart={filter.lineChart}
              step={1000 * 60 * 30}
              speed={filter.speed}
              histogram={filter.enlarged ? filter.enlargedHistogram : filter.histogram}
              onChange={onSetTimeFilter}
              toggleAnimation={toggleAnimation}
              isAnimatable={isAnimatable}
              isEnlarged={filter.enlarged}
              timeFormat={' HH:mm'}
              hideTimeTitle={hideTimeTitle}
            />
          </div>
        )}
      </div>
    );
  });
}
