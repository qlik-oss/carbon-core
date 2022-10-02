export const buildEvent = (nativeEvent) => {
  if (nativeEvent.transformed) {
    return nativeEvent;
  }
  if(!nativeEvent.touches) {
    nativeEvent.touches = [];
  }
  if (nativeEvent.touches.length === 0) {
    nativeEvent.touches.push({
      locationX: nativeEvent.x,
      locationY: nativeEvent.y,
    });
  }
  return {
    transformed: true,
    clientX: nativeEvent.x,
    clientY: nativeEvent.y,
    touches: nativeEvent.touches.map((evt) => {
      return {
        clientX: evt.locationX,
        clientY: evt.locationY,
      };
    }),
    changedTouches: nativeEvent.touches.map((evt) => {
      return {
        clientX: evt.locationX,
        clientY: evt.locationY,
      };
    }),
  };
};
