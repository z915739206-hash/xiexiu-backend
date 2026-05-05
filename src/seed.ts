import { prisma } from "./lib/prisma.js"

async function seed() {
  const existing = await prisma.recipe.count()
  if (existing > 0) {
    console.log("Recipes already seeded, skipping.")
    return
  }

  const recipes = [
    {
      nameEn: "Tomato Egg Stir-fry",
      nameZh: "番茄炒蛋",
      namePinyin: "Fān Qié Chǎo Dàn",
      category: "fridge",
      imageGradient: "linear-gradient(135deg, #FF7A45 0%, #FFB37A 50%, #FFD58A 100%)",
      emoji: "🍳",
      speed: 5,
      cleanPan: 4,
      foolproof: 5,
      minutes: 8,
      description: "The undisputed grandma classic. Sweet, savory, ridiculously fast. We sneak in a little ketchup so it never fails.",
      isPremium: false,
      tricks: [
        { icon: "Bolt", text: "Pre-beat the eggs while the pan heats — saves 90 seconds." },
        { icon: "Sparkles", text: "Add 1 tsp ketchup. Color pops, no shame." },
        { icon: "Flame", text: "Take eggs out at 80% — they finish cooking in residual heat." },
      ],
      steps: [
        { order: 1, title: "Prep", body: "Cut tomatoes into wedges. Beat 3 eggs with a pinch of salt.", sneaky: "Use a fork. We don't own a whisk in this house." },
        { order: 2, title: "Eggs first", body: "High heat, generous oil. Pour eggs, swirl, fold, set aside still wobbly." },
        { order: 3, title: "Tomato base", body: "Same pan. Add tomatoes + 1 tsp ketchup + pinch of sugar. Cook till saucy.", sneaky: "Lid on for 60s. Tomatoes melt themselves." },
        { order: 4, title: "Reunion", body: "Return eggs, toss for 20 seconds. Top with scallion." },
      ],
      uses: [
        { ingredientId: "tomato", nameEn: "Tomato", nameZh: "番茄", emoji: "🍅" },
        { ingredientId: "egg", nameEn: "Egg", nameZh: "鸡蛋", emoji: "🥚" },
        { ingredientId: "scallion", nameEn: "Scallion", nameZh: "小葱", emoji: "🌿" },
      ],
    },
    {
      nameEn: "Spinach Noodle Soup",
      nameZh: "菠菜面",
      namePinyin: "Bō Cài Miàn",
      category: "onepan",
      imageGradient: "linear-gradient(135deg, #7BB661 0%, #F4D58D 100%)",
      emoji: "🍜",
      speed: 5,
      cleanPan: 5,
      foolproof: 5,
      minutes: 7,
      description: "Save your wilted spinach. One pot, one bowl, one happy soul.",
      isPremium: false,
      tricks: [
        { icon: "Droplets", text: "Boil noodles in the broth — fewer dishes, more flavor." },
        { icon: "Egg", text: "Crack the egg straight in. Lid on for 90s = poached." },
      ],
      steps: [
        { order: 1, title: "Boil", body: "Bring 600ml water + soy + garlic to a boil." },
        { order: 2, title: "Noodles", body: "Drop noodles, cook 4 minutes." },
        { order: 3, title: "Greens & egg", body: "Add spinach, crack in an egg, lid on for 90s." },
        { order: 4, title: "Bowl up", body: "Splash sesame oil. Slurp loudly." },
      ],
      uses: [
        { ingredientId: "spinach", nameEn: "Spinach", nameZh: "菠菜", emoji: "🥬" },
        { ingredientId: "noodle", nameEn: "Wheat Noodle", nameZh: "挂面", emoji: "🍜" },
        { ingredientId: "egg", nameEn: "Egg", nameZh: "鸡蛋", emoji: "🥚" },
        { ingredientId: "garlic", nameEn: "Garlic", nameZh: "大蒜", emoji: "🧄" },
      ],
    },
    {
      nameEn: "Lazy Mapo Tofu",
      nameZh: "麻婆豆腐",
      namePinyin: "Má Pó Dòu Fǔ",
      category: "fridge",
      imageGradient: "linear-gradient(135deg, #D9384A 0%, #FF7A45 100%)",
      emoji: "🌶️",
      speed: 4,
      cleanPan: 3,
      foolproof: 4,
      minutes: 12,
      description: "The numbing-spicy comfort food of champions. Skip the bean paste, raid your soy.",
      isPremium: true,
      tricks: [
        { icon: "Timer", text: "Cube tofu IN the box with a knife. Less mess." },
        { icon: "Flame", text: "Brown pork hard before adding sauce — flavor unlock." },
      ],
      steps: [
        { order: 1, title: "Cube tofu", body: "Cut tofu inside the package. Slide into hot water to firm up." },
        { order: 2, title: "Brown pork", body: "Hot pan, oil, pork. Don't move it for 60 seconds." },
        { order: 3, title: "Build sauce", body: "Garlic, chili flakes, 2 tbsp soy, 1 tbsp sugar, splash water." },
        { order: 4, title: "Marry", body: "Slide in tofu. Simmer 3 min. Top with scallion." },
      ],
      uses: [
        { ingredientId: "tofu", nameEn: "Silken Tofu", nameZh: "嫩豆腐", emoji: "⬜" },
        { ingredientId: "pork", nameEn: "Pork Mince", nameZh: "猪肉末", emoji: "🥩" },
        { ingredientId: "garlic", nameEn: "Garlic", nameZh: "大蒜", emoji: "🧄" },
        { ingredientId: "scallion", nameEn: "Scallion", nameZh: "小葱", emoji: "🌿" },
      ],
    },
    {
      nameEn: "Garlic Shrimp Fried Rice",
      nameZh: "蒜蓉虾仁炒饭",
      namePinyin: "Suàn Róng Xiā Rén Chǎo Fàn",
      category: "fast",
      imageGradient: "linear-gradient(135deg, #FFA38A 0%, #FFD58A 100%)",
      emoji: "🍤",
      speed: 5,
      cleanPan: 4,
      foolproof: 5,
      minutes: 10,
      description: "Day-old rice + frozen shrimp = restaurant-grade weeknight win.",
      isPremium: true,
      tricks: [
        { icon: "Snowflake", text: "Cook shrimp from frozen. Honestly. It works." },
        { icon: "Bowl", text: "Crumble cold rice with hands before it hits the pan." },
      ],
      steps: [
        { order: 1, title: "Wake the rice", body: "Sprinkle 1 tbsp water on cold rice, microwave 60s." },
        { order: 2, title: "Shrimp + garlic", body: "Sear shrimp + garlic in oil. 90 seconds. Set aside." },
        { order: 3, title: "Eggs & rice", body: "Scramble eggs, dump rice, toss till every grain dances." },
        { order: 4, title: "Reunite", body: "Shrimp back in, soy splash, scallion confetti." },
      ],
      uses: [
        { ingredientId: "shrimp", nameEn: "Shrimp", nameZh: "虾仁", emoji: "🦐" },
        { ingredientId: "rice", nameEn: "Jasmine Rice", nameZh: "茉莉香米", emoji: "🍚" },
        { ingredientId: "egg", nameEn: "Egg", nameZh: "鸡蛋", emoji: "🥚" },
        { ingredientId: "garlic", nameEn: "Garlic", nameZh: "大蒜", emoji: "🧄" },
        { ingredientId: "scallion", nameEn: "Scallion", nameZh: "小葱", emoji: "🌿" },
      ],
    },
    {
      nameEn: "Microwave Steamed Egg",
      nameZh: "微波蒸蛋",
      namePinyin: "Wēi Bō Zhēng Dàn",
      category: "microwave",
      imageGradient: "linear-gradient(135deg, #FFD58A 0%, #FFF1D6 100%)",
      emoji: "🥣",
      speed: 5,
      cleanPan: 5,
      foolproof: 4,
      minutes: 4,
      description: "Silky steamed egg in a mug. No steamer, no judgment.",
      isPremium: false,
      tricks: [
        { icon: "Microwave", text: "Cover with plate — that's your steamer." },
        { icon: "Droplets", text: "1 part egg : 1.5 parts warm water for the silkiest texture." },
      ],
      steps: [
        { order: 1, title: "Mix", body: "Beat 2 eggs + 180ml warm water + pinch salt. Strain." },
        { order: 2, title: "Microwave", body: "Cover. 50% power. 3 minutes. Don't peek." },
        { order: 3, title: "Finish", body: "Drizzle soy + sesame oil. Scallion on top." },
      ],
      uses: [
        { ingredientId: "egg", nameEn: "Egg", nameZh: "鸡蛋", emoji: "🥚" },
        { ingredientId: "soy", nameEn: "Soy Sauce", nameZh: "生抽", emoji: "🫙" },
        { ingredientId: "scallion", nameEn: "Scallion", nameZh: "小葱", emoji: "🌿" },
      ],
    },
    {
      nameEn: "Cucumber-Garlic Smash",
      nameZh: "拍黄瓜",
      namePinyin: "Pāi Huáng Guā",
      category: "weird",
      imageGradient: "linear-gradient(135deg, #9DD17D 0%, #DCE9B0 100%)",
      emoji: "🥒",
      speed: 5,
      cleanPan: 5,
      foolproof: 5,
      minutes: 5,
      description: "Smash, salt, soak. The world's most violent salad.",
      isPremium: false,
      tricks: [
        { icon: "Hammer", text: "Whack with a flat knife. More surface = more sauce cling." },
      ],
      steps: [
        { order: 1, title: "Smash", body: "Smash cucumber, tear into chunks." },
        { order: 2, title: "Salt", body: "Toss with 1/2 tsp salt. Wait 5 min, drain water." },
        { order: 3, title: "Dress", body: "Garlic + soy + vinegar + chili oil. Toss. Done." },
      ],
      uses: [
        { ingredientId: "garlic", nameEn: "Garlic", nameZh: "大蒜", emoji: "🧄" },
        { ingredientId: "soy", nameEn: "Soy Sauce", nameZh: "生抽", emoji: "🫙" },
      ],
    },
  ]

  for (const r of recipes) {
    await prisma.recipe.create({
      data: {
        nameEn: r.nameEn,
        nameZh: r.nameZh,
        namePinyin: r.namePinyin,
        category: r.category,
        imageGradient: r.imageGradient,
        emoji: r.emoji,
        speed: r.speed,
        cleanPan: r.cleanPan,
        foolproof: r.foolproof,
        minutes: r.minutes,
        description: r.description,
        isPremium: r.isPremium,
        tricks: { create: r.tricks },
        steps: { create: r.steps },
        uses: { create: r.uses },
      },
    })
  }

  console.log(`Seeded ${recipes.length} recipes.`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
