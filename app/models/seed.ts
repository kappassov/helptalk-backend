type Role = {
  name: string;
};

async function seed() {
  await Promise.all(
    getRoles().map((role) => {
      return prisma.role.create({
        data: {
          name: role.name,
        },
      });
    })
  );
}

seed();

function getRoles(): Array<Role> {
  return [
    {
      name: "patient",
    },
    {
      name: "specialist",
    },
    {
      name: "admin",
    },
  ];
}