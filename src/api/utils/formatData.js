export const formatGithubRepositoriesResponse = (repositories) => ({
  count: repositories.length,
  repositories,
});

export const formatEventResponse = (eventResult) => {
  const { _id, type, eventFilters = [], animation } = eventResult;

  return {
    _id,
    type,
    eventFilters,
    animation,
  };
};

export const formatEventsResponse = (events) => ({
  count: events.length,
  events,
});
