export const formatEventsResponse = (events) => {
  return {
    count: events.length,
    events,
  };
};

export const formatEventResponse = (eventResult) => {
  const { _id, type, light_animation } = eventResult;

  return {
    _id,
    type,
    light_animation,
  };
};
