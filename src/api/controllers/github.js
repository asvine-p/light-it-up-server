import GithubRepository from '../models/github_repositories';
import Event from '../models/events';
import events from 'events';
import _ from 'lodash';

const githubEventEmitter = new events.EventEmitter();

export const onPing = async (payload) => {
  try {
    const { repository = {}, hook: { events } = {} } = payload;

    await GithubRepository.updateOne(
      { repository_id: repository.id },
      {
        repository_id: repository.id,
        events,
        ...repository,
      },
      {
        upsert: true,
      },
    ).exec();
  } catch (e) {
    console.log('error on Ping', e);
  }
};

const findMatchingEventFromFilters = (events = [], githubPayload = {}) => {
  return events.find((event) => {
    const { event_filters: { filters } = {} } = event;

    return filters.reduce((acc, currentFilter) => {
      if (acc) {
        const { filter_key, filter_value } = currentFilter;

        // FIND IN GITHUB PAYLOAD THE VALUE OF GIVEN KEY USING LODASH
        const matchingValue = _.get(githubPayload, filter_key);

        return matchingValue === filter_value;
      }
      return false;
    }, true);
  });
};

export const onEvent = async (eventName, payload) => {
  const { repository: { name: repositoryName } = {} } = payload;

  // SEARCH FOR EVENTS MARCHING EVENT_NAME AND REPO NAME
  const foundEvents = await Event.find({
    type: 'github',
    'event_filters.event_name': eventName,
    'event_filters.repository_name': repositoryName,
  }).exec();


  if (foundEvents && foundEvents.length) {
    const event = findMatchingEventFromFilters(foundEvents, payload);
    if (event) {
      const { light_animation } = event;
      // EMIT LIGHTS
      githubEventEmitter.emit('githubEvent', light_animation);
    }
  }
};

export const githubEmitter = githubEventEmitter;
