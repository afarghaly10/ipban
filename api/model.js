'use strict';

const db = require('../utility/database');

const TABLE = 'bannedIps';
const model = {
	create: async (body) => {
		return await db.run(db.insert().into(TABLE).values(body));
	},
	get: async (ip) => {
		const [bannedIp] = await db.run(
			db.select().all().from(TABLE).where({ ip, deletedAt: null })
		);
		return bannedIp;
	},
  list: async () => {
    return await db.run(
      db
      .select()
      .all()
      .from(TABLE)
      .where({deletedAt: null})
    )
  },
	delete: async (ip) => {
		return await db.run(
			db.update().table(TABLE).set({ deletedAt: db.expr.now() }).where({ ip })
		);
	},
};

module.exports = model;


// POST http://localhost:3000/api/ban
// {
//   "ip": "192.168.1.100",
//   "reason": "Brute force attack",
//   "expires_at": "2025-01-01T00:00:00Z"
// }

// check
// GET http://localhost:3000/api/ban/192.168.1.100
// list
// GET http://localhost:3000/api/ban
