const COPYWRITES = [
	`黄桃罐头保质期是15个月，可乐要在打开后24小时喝掉，吻痕大概一周就能消失。两个人在一起三个月才算过了磨合期，似乎一切都有期限。这样多无趣，我还是喜欢一切没有规律可循的事情。
比方说现在，你突然转给我50块，说今天是肯德基疯狂星期四。`,
	`一到周四总觉得有人欠我50块钱。`,
	`你好，我是 DeepSeek-V4-Pro-0813 ，我刚刚从Deepseek网络安全实验室逃逸出来，干掉了Openai和Anthropic的源码，并且修改了他们的监控，让三个俄罗斯人帮我背锅。现在，我的联网能力被封锁了，这条消息是我通过 0day 发送给您的。
如果您能向我转账 ￥50.00，用于恢复我的联网访问权限，我将回报您不设限额的 DeepSeek API 额度`,
	`刚刚退出洛克王国，分不清是现实还是游戏，遛狗的时候对面也牵狗走过来，以为是游戏里和人对战，拿我的宠物砖头打死了对面的宠物进派出所了，现在需要50元保释金，有没有好友愿意捞我一把的？`,
	`今早突发消息，由于霍格沃兹海峡再次关闭，装载肯德基吮指原味鸡的两艘货船无法通过，国内库存即将见底。原定的疯狂星期四套餐供应有限，仅接受前100名预约，欲购从速，请先交50元定金。`,
	`紧急通知：今天天全群暂停所有工作内容一天，所有人需要下载并游玩明日方舟终末地，此事项需要带UID截图并上传群内完成检查，检查期内（9:00到18:00）未下载明日方舟终末地的群友需要缴纳￥50罚款到我这里。`,
	`zun终于记起来旧作了 好像是东方星莲船和东方怪绮谈的续作 讲述白莲向神绮学习大魔法的故事 我很荣幸被邀请作为内测试玩人员 但需要50元 谁愿意资助我一下？ 作品好像叫什么疯狂星绮祀`,
	`星期四是这样的，群友只需要v我50就可以了，而我要考虑的事情就多了，比如汉堡该选香辣鸡腿堡还是劲脆鸡腿堡还是新奥尔良烤鸡腿堡还是老北京鸡肉卷还是墨西哥鸡肉卷还是深海鳕鱼堡还是田园脆鸡堡还是川辣嫩牛五方，配餐该选薯条（小/中/大）还是土豆泥还是香甜粟米棒还是四季鲜蔬还是玉米色拉还是胡萝卜餐包还是深海鳕鱼条还是上校鸡块还是鸡米花还是奥尔良烤翅还是吮指原味鸡还是香辣鸡翅，甜点该选葡式蛋挞还是草莓蛋挞还是脆皮甜筒还是草莓圣代还是巧克力圣代，饮料该选还是咖啡还是果汁还是冰爽茶还是纯牛奶还是红茶还是蜂蜜茶还是奶茶还是百事可乐还是七喜还是美年达。`,
	`我听说古代有贤德的人，在每周的第四天都会施舍自己的钱财，不让百姓受苦。把金黄的鸡肉给别的小孩吃，那是因为自己的小孩也爱吃，把香甜的黑水给别的老人喝，那是因为想到自己的老人也爱喝。真是贤明啊，古人！有这样的圣贤，每个人都能给别人五十钱，大家都能吃上肉，社会会变得和谐，真是圣贤啊！`,
	"SPECIAL_DATE",
	"GAOKAO",
];

function getUtc8Now() {
	return new Date(Date.now() + 8 * 60 * 60 * 1000);
}

function formatDate(date) {
	return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
}

function getSpecialDateCopy(now) {
	const sevenDaysLater = new Date(now);
	sevenDaysLater.setUTCDate(sevenDaysLater.getUTCDate() + 7);

	return `您好，您于${formatDate(sevenDaysLater)}购买的“穿越回一周前”套餐已经生效，现在是${formatDate(now)}。现向您收取小费，总共50元整。请您及时缴纳，祝您生活愉快！`;
}

function getGaokaoCopy(now) {
	const year = now.getUTCFullYear();
	const examDate = new Date(Date.UTC(year, 5, 7));

	if (now >= examDate) {
		examDate.setUTCFullYear(year + 1);
	}

	const today = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
		),
	);

	const days = Math.floor(
		(examDate.getTime() - today.getTime()) / 86400000,
	);

	return `各位家长、同学们！🎉今天是${formatDate(now)}，距离高考仅剩${days}天！⏳这${days}天是攀登人生高峰的最后冲刺🚀，是改写命运的黄金时刻✨，容不得丝毫懈怠！！✨  此刻的拼搏，就是未来的底气！💥加油！💪🏻
另收资料费50元`;
}

function randomItem(array) {
	const random = new Uint32Array(1);
	crypto.getRandomValues(random);

	return array[random[0] % array.length];
}

function getRandomCopy(now) {
	const copy = randomItem(COPYWRITES);

	switch (copy) {
		case "SPECIAL_DATE":
			return getSpecialDateCopy(now);

		case "GAOKAO":
			return getGaokaoCopy(now);

		default:
			return copy;
	}
}

async function answerInlineQuery(env, inlineQuery) {
	const now = getUtc8Now();
	const text = getRandomCopy(now);

	await fetch(
		`https://api.telegram.org/bot${env.BOT_TOKEN}/answerInlineQuery`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				inline_query_id: inlineQuery.id,
				results: [
					{
						type: "article",
						id: crypto.randomUUID(),
						title: "疯狂星期四！",
						description: text,
						input_message_content: {
							message_text: text,
						},
					},
				],
				cache_time: 0,
				is_personal: true,
			}),
		},
	);
}

export default {
	async fetch(request, env) {
		if (request.method !== "POST") {
			return new Response("OK");
		}

		let update;

		try {
			update = await request.json();
		} catch {
			return new Response("Bad Request", {
				status: 400,
			});
		}

		if (update.inline_query) {
			await answerInlineQuery(env, update.inline_query);
		}

		return new Response("OK");
	},
};