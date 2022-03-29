import './lib/init.js';

import PKG from './lib/global/package.js';
import C from './lib/global/config.js';
import G from './lib/global/log.js';

import StaffWock from '@hey/hey-staff-wock';


const staff = () => {
	G.debug('主线', '定期~[通知]', '✔ ');

	return { title: C.push.title, body: C.push.body };
};



const wockStaff = new StaffWock(
	C.target,
	PKG.name, C.auth.id,
	C.auth.who, C.auth.token,
	C.push.interval, staff,
	(...params) => G.info('Wock', '信息', ...params),
	(...params) => G.error('Wock', '错误', ...params),
);


wockStaff.add('auth-successful', () => G.info('~[Hey]通讯', '认证', '✔ '));
wockStaff.add('auth-failed', error => G.error('~[Hey]通讯', '认证', `✖ ${error.message ?? error}`));
wockStaff.add('staff-start', () => G.info('~[Hey]通讯', '开始~[工作]', '✔ '));
wockStaff.add('staff-stop', () => G.info('~[Hey]通讯', '停止~[工作]', '✔ '));

wockStaff.add('set-auth', (id, who, token) => C.$.edit('auth', auth => {
	G.info('~[Hey]通讯', '更新~[认证信息]', '✔ ',
		`~[id]~{${id}}`,
		`~[who]~{${who}}`,
		`~[token]~{${token}}`,
	);

	return { id, who, token };
}));


wockStaff.open();
