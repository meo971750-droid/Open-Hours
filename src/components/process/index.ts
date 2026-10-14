import Scene1Search from './Scene1Search';
import Scene2Apply from './Scene2Apply';
import Scene3Portal from './Scene3Portal';
import Scene4Found from './Scene4Found';
import Scene5SilentSalesman from './Scene5SilentSalesman';
import Scene6AlwaysOn from './Scene6AlwaysOn';

export {
  Scene1Search,
  Scene2Apply,
  Scene3Portal,
  Scene4Found,
  Scene5SilentSalesman,
  Scene6AlwaysOn,
};

export const SCENES = [
  Scene1Search,
  Scene2Apply,
  Scene3Portal,
  Scene4Found,
  Scene5SilentSalesman,
  Scene6AlwaysOn,
] as const;

export * from './types';
