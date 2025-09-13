const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');  // use bcryptjs like in package.json


const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

  const acme = await prisma.tenant.upsert({
    where: { slug: "acme" },
    update: {},
    create: {
      slug: "acme",
      name: "Acme",
    },
  });

  const globex = await prisma.tenant.upsert({
    where: { slug: "globex" },
    update: {},
    create: {
      slug: "globex",
      name: "Globex",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@acme.test" },
    update: {},
    create: {
      email: "admin@acme.test",
      password: hashedPassword,
      role: "ADMIN",
      tenantId: acme.id,
    },
  });
  await prisma.user.upsert({
    where: { email: "user@acme.test" },
    update: {},
    create: {
      email: "user@acme.test",
      password: hashedPassword,
      role: "MEMBER",
      tenantId: acme.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@globex.test" },
    update: {},
    create: {
      email: "admin@globex.test",
      password: hashedPassword,
      role: "ADMIN",
      tenantId: globex.id,
    },
  });
  await prisma.user.upsert({
    where: { email: "user@globex.test" },
    update: {},
    create: {
      email: "user@globex.test",
      password: hashedPassword,
      role: "MEMBER",
      tenantId: globex.id,
    },
  });
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
