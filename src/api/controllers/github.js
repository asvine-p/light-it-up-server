import Events from 'events';
import _ from 'lodash';
import GithubRepository from '../models/githubRepositories';
import Event from '../models/events';

const githubEventEmitter = new Events.EventEmitter();

export const onPing = async (payload) => {
  try {
    const { repository = {}, hook: { events } = {} } = payload;

    const { id: repository_id } = repository;

    await GithubRepository.updateOne(
      { repository_id },
      {
        repository_id,
        events,
        ...repository,
      },
      {
        upsert: true,
      },
    ).exec();
  } catch (e) {
    console.log('error on Ping', e); // eslint-disable-line no-console
  }
};

const findMatchingEventFromFilters = (events = [], githubPayload = {}) =>
  events.find((event) => {
    const { eventFilters: { filters } = {} } = event;

    return filters.reduce((acc, currentFilter) => {
      if (acc) {
        const { filterKey, filterValue } = currentFilter;
        // FIND IN GITHUB PAYLOAD THE VALUE OF GIVEN KEY USING LODASH
        const matchingValue = _.get(githubPayload, filterKey);

        return matchingValue === filterValue;
      }
      return false;
    }, true);
  });

export const onEvent = async (eventName, payload) => {
  const { repository: { name: repositoryName } = {} } = payload;

  // SEARCH FOR EVENTS MARCHING EVENT_NAME AND REPO NAME
  const foundEvents = await Event.find({
    type: 'GitHub',
    'eventFilters.eventName': eventName,
    'eventFilters.repositoryName': repositoryName,
  })
    .populate({
      path: 'animation',
      populate: { path: 'lightAnimation', model: 'LightAnimation' },
    })
    .exec();

  if (foundEvents && foundEvents.length) {
    const event = findMatchingEventFromFilters(foundEvents, payload);

    if (event) {
      const { animation } = event;

      // EMIT LIGHTS
      githubEventEmitter.emit('githubEvent', animation);
    }
  }
};

export const githubEmitter = githubEventEmitter;
