import User from './user'
import Info from './info'
import Tips from './Tips'
import Render from './render'
import Token from './tokenVerify';

export default app => {
  app.use ('/tollgate', Token);
  app.use ('/tollgate/user', User);
  app.use ('/tollgate/info', Info);
  app.use ('/tollgate/tips', Tips);
  app.use ('/tollgate/render', Render);
}
