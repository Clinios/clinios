/**
 * A basic height control HOC component
 * that modifies Layout Items minHeight dynamically
 * Not exclusive to min height, can be height if you
 * do not want to allow users to resize your component
 */

import React from 'react';


export default function heightHOC(COMPONENT) {
  return class HeightLayerHOC extends React.PureComponent {
  
    // Ref used to identify own DOM element
    self = React.createRef();
    currentHeight = 0;
  
    // We update the height on any potential change
    componentDidUpdate() {
      this.calculateHeight();
    }
    
    calculateHeight() {
      if (!this.self.current) {
        return;
      }
      
      // Unnecessary to assign value to a variable
      // This is in place only to serve as an example of the values purpose
      // We take the offsetHeight of the child of this layout HOC wrapper
      const minHeight = this.self.current.children[0].offsetHeight;

      // Pointless updates begone
      if (minHeight === this.currentHeight) {
        return;
      }
      
      this.currentHeight = minHeight;
      // Either a connected redux action or whatever else you prefer
      // this.props.updateMinHeight('<your key for this item goes here>', minHeight);
      this.props.updateMinHeight(this.props.title, minHeight);
      // The update method should map over an existing array for the current breakpoint
      // and update the item by its key with the new given value
      // Example:
      //  myLayouts[myCurrentBreakpoint] = myLayouts[myCurrentBreakpoint]
      //    .map(item => item === key ? { ...item, minH: newMinHeight } : item);
    }
  
    render() {
      // You can filter out props here if needed
      return (
        <div ref={this.self} className="height-layer">
          <COMPONENT {...this.props} />
        </div>
      );
    }
  }
}

