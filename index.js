import './lib/init.js';

import PKG from './lib/global/package.js';
import Wock from './lib/Wock.js';

import C from './lib/global/config.js';
import G from './lib/global/log.js';


if(!~~C.interval || ~~C.interval < 1000) { throw Error('间隔无效或小于一秒'); }


const wock = new Wock(new URL('wock', `http://${C.target.host}:${C.target.port}`).toString().replace(/^http/, 'ws'));



const hey = push => wock.cast('hey/push', push);

const run = async () => {
	hey({ title: C.title, body: C.body });

	G.debug('主线', '定期~[通知]', '✔ ');
};



let intervalRun;

wock.add('start', () => {
	run();

	intervalRun = setInterval(run, C.interval);
});

wock.add('stop', () => clearInterval(intervalRun));


wock.add('auth-failed', (error) => {
	G.error('主线', '认证', `✖ ${error.message ?? error}`);
});


const authStaff = () => {
	if(C.token) {
		wock.cast('profile/auth-staff', PKG.name, C.token);
	}
};

wock.add('setToken', token => {
	C.$.edit('token', () => token);

	authStaff();
});


wock.reopen = authStaff;
wock.at('open', authStaff, true);

wock.open();
