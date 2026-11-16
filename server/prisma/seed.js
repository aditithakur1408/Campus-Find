const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial categories and campus locations...');

  const categories = [
    { name: 'Electronics & Gadgets', iconName: 'Laptop', description: 'Phones, laptops, earphones, chargers, power banks' },
    { name: 'Wallets & Money', iconName: 'Wallet', description: 'Wallets, purses, cash, money clips' },
    { name: 'IDs, Cards & Documents', iconName: 'CreditCard', description: 'College ID cards, driver licenses, metro cards' },
    { name: 'Keys & Keychains', iconName: 'Key', description: 'Room keys, vehicle keys, cycle locks' },
    { name: 'Bags & Backpacks', iconName: 'Backpack', description: 'Backpacks, tote bags, gym bags, laptop sleeves' },
    { name: 'Books & Stationery', iconName: 'Book', description: 'Textbooks, notebooks, calculators, pencil pouches' },
    { name: 'Clothing & Wearables', iconName: 'Shirt', description: 'Jackets, hoodies, caps, watches, jewelry' },
    { name: 'Bottles & Personal Items', iconName: 'Coffee', description: 'Water bottles, umbrellas, glasses, cosmetics' },
    { name: 'Others', iconName: 'HelpCircle', description: 'Miscellaneous misplaced items' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  const locations = [
    { buildingName: 'Central Library', zoneFloor: 'Ground Floor / Circulation Desk', hasSecurityDesk: true },
    { buildingName: 'Central Library', zoneFloor: '1st Floor - Silent Study Hall', hasSecurityDesk: false },
    { buildingName: 'Central Library', zoneFloor: '2nd Floor - Digital Lab', hasSecurityDesk: false },
    { buildingName: 'Academic Block A', zoneFloor: 'Ground Floor - Main Lobby', hasSecurityDesk: true },
    { buildingName: 'Academic Block A', zoneFloor: '2nd Floor - Computer Labs', hasSecurityDesk: false },
    { buildingName: 'Academic Block B', zoneFloor: '1st Floor - Lecture Theatres', hasSecurityDesk: false },
    { buildingName: 'Campus Cafeteria', zoneFloor: 'Main Dining Hall', hasSecurityDesk: false },
    { buildingName: 'Sports Complex', zoneFloor: 'Gymnasium & Indoor Court', hasSecurityDesk: true },
    { buildingName: 'Admin Building', zoneFloor: 'Ground Floor - Security Control Room', hasSecurityDesk: true },
    { buildingName: 'Student Centre', zoneFloor: 'Common Room / Activity Area', hasSecurityDesk: false },
  ];

  for (const loc of locations) {
    await prisma.location.upsert({
      where: {
        buildingName_zoneFloor: {
          buildingName: loc.buildingName,
          zoneFloor: loc.zoneFloor,
        },
      },
      update: {},
      create: loc,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
