import './lib/init.js';

import { publicEncrypt } from 'crypto';

import Axios from 'axios';

import C from './lib/global/config.js';
import G from './lib/global/log.js';
import PKG from './lib/global/package.js';


if(!~~C.interval || ~~C.interval < 1000) { throw Error('间隔无效或小于一秒'); }


setInterval(async () => {
	try {
		const { data: result } = await Axios.post(`http://${C.target.host}:${C.target.port}/api/tell/push`, {
			from: publicEncrypt(
				C.publicKey.from,
				Buffer.from(JSON.stringify({ who: C.id, app: PKG.name, }))
			).toString('base64'),

			data: publicEncrypt(
				C.publicKey.data,
				Buffer.from(JSON.stringify({
					title: C.title,
				}))
			).toString('base64')
		}, { timeout: 1000 * 30 });


		if(result?.success) {
			G.info('主线', '发送~[推送]', `✔ `);
		}
		else {
			throw Error(result?.message);
		}
	}
	catch(error) {
		G.error('主线', '发送~[推送]', `✖ ${error?.message ?? error}`);
	}
}, C.interval);