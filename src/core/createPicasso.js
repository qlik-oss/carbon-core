import picasso from 'picasso.js';
import picassoQ from 'picasso-plugin-q';
import {carbonRenderer} from './carbonRenderer';
import {kinesics} from '../plugins/kinesics';

export const createPicasso = ({renderer}) => {
  picasso.renderer('carbon', carbonRenderer);
  picasso.interaction('kinesics', kinesics);

  const pic = picasso({
    renderer: {
      prio: ['carbon'],
    },
  });
  pic.use(picassoQ);
  return {pic, picassoQ};
};
