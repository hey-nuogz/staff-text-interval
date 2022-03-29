import Wock from './Wock.js';

import PKG from './global/package.js';
import C from './global/config.js';
import G from './global/log.js';


const wocker = new Wock(new URL('wock', `http://${C.target.host}:${C.target.port}`).toString().replace(/^http/, 'ws'));



let intervalRun;

wocker.add('start', () => {
	if(typeof wocker.runner != 'function') { return; }

	intervalRun = setInterval(wocker.runner, C.interval);

	wocker.runner();
});

wocker.add('stop', () => clearInterval(intervalRun));


wocker.add('auth-failed', (error) => {
	G.error('主线', '认证', `✖ ${error.message ?? error}`);
});


const authStaff = () => {
	if(C.token) {
		wocker.cast('profile/auth-staff', PKG.name, C.token);
	}
};

wocker.add('setToken', token => {
	C.$.edit('token', () => token);

	authStaff();
});


wocker.reopen = authStaff;
wocker.at('open', authStaff, true);

wocker.open();


export default wocker;
