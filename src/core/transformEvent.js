import {buildEvent} from './buildEvent';

export const transformEvent = (nativeEvent) => {
  const event = buildEvent({...nativeEvent});
  return event;
};
