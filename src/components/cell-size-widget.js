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

import React from 'react';
import LayerConfigGroup from './side-panel/layer-panel/layer-config-group';
import VisConfigSlider from './side-panel/layer-panel/vis-config-slider';
import PropTypes from 'prop-types';
import {BottomWidgetInner} from 'components/common/styled-components';

export class CellSizeWidget extends React.Component {
  render() {
    return (
      <BottomWidgetInner className="bottom-widget--inner">
        <LayerConfigGroup label={'layer.radius'} collapsible>
          <VisConfigSlider
            {...this.props.aggLayer.visConfigSettings.worldUnitSize}
            layer={this.props.aggLayer}
            onChange={this.props.onChange}
            range={[0.75, 20]}
            step={0.01}
          />
        </LayerConfigGroup>
      </BottomWidgetInner>
    );
  }
}

CellSizeWidget.propTypes = {
  aggLayer: PropTypes.any,
  onChange: PropTypes.func
};
