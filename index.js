import './lib/init.js';

import PKG from './lib/global/package.js';
import C from './lib/global/config.js';
import G from './lib/global/log.js';


import StaffWock from '@hey/hey-staff-wock';

const staff = () => {
	G.debug('主线', '定期~[通知]', '✔ ');

	return { title: C.title, body: C.body };
};


const wockStaff = new StaffWock(
	C.target,
	PKG.name, C.token,
	C.interval, staff
);


wockStaff.add('authed', () => G.info('主线', '认证', '✔ '));
wockStaff.add('auth-failed', error => G.error('主线', '认证', `✖ ${error.message ?? error}`));
wockStaff.add('start', () => G.info('主线', '开始 ~[Staff]', '✔ '));
wockStaff.add('stop', () => G.info('主线', '停止 ~[Staff]', '✔ '));

wockStaff.add('setToken', token => C.$.edit('token', () => token));


wockStaff.open();
