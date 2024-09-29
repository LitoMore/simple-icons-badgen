import * as si from 'simple-icons';
import { getIconSvg } from '../source/icon.ts';

const checkAutoViewboxPath = (icon: si.SimpleIcon) => {
	const start = performance.now();
	try {
		const iconSvg = getIconSvg(icon, { viewbox: 'auto' });
		const end = performance.now();
		if (iconSvg) {
			return { title: icon.title, time: end - start };
		}
		throw new Error('Path is empty');
	} catch (error) {
		const end = performance.now();
		console.error(
			`Error in icon: ${icon.title}: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`,
		);
		return { title: icon.title, time: end - start, fail: true };
	}
};

const result = Object.values(si).map((icon) =>
	checkAutoViewboxPath(icon as si.SimpleIcon)
);
const iconsFailed = result.filter((r) => r.fail);

console.log('Top 10 slow icons:');
console.table(
	result.sort((a, b) => b.time - a.time).slice(0, 10).map((x) => ({
		title: x.title,
		['time (ms)']: Number(x.time.toFixed(3)),
	})),
);

const iconArgs = Deno.args;
if (iconArgs.length > 0) {
	console.table(
		result.filter((r) => iconArgs.includes(r.title)).map((x) => ({
			title: x.title,
			['time (ms)']: Number(x.time.toFixed(3)),
		})),
	);
}

if (iconsFailed.length > 0) {
	console.log(`Failed icons:`);
	console.table(iconsFailed);
	Deno.exit(1);
} else {
	console.log('All icons passed');
	Deno.exit(0);
}
