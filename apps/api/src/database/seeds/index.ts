/**
 * Seed entrypoint. Per Phase 1 §9 Rule 25, all seed data must be idempotent
 * and re-runnable — every step below is an `upsert` (or an equivalent
 * existence-check for Semester, which has no unique column of its own),
 * never a plain `create`, so running `pnpm db:seed` twice is always safe.
 *
 * Milestone 3 seeds exactly enough real data for the Academic Descent
 * (Course → Branch → Semester → Subject) to be genuinely browsable
 * end-to-end, matching Part 3's described v1 state: B.Tech is the one
 * live Course, everything else is seeded as `COMING_SOON` so the "one
 * bright option among many honestly-in-progress peers" UX (Part 3 §3) is
 * real, not simulated. AI & DS is the one Branch with real Subject
 * content; the other two active branches (AI & ML, IIoT) are seeded with
 * no subjects yet, so the frontend's empty state is also exercised
 * against real data rather than only against a mock.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // --- Identity: one system/admin User to own every created_by_id FK ---
  const admin = await prisma.user.upsert({
    where: { email: 'admin@planb.internal' },
    update: {},
    create: {
      email: 'admin@planb.internal',
      name: 'Plan B Admin',
      role: 'ADMIN',
    },
  });

  // --- Academic Structure: University ---
  const university = await prisma.university.upsert({
    where: { shortCode: 'GGSIPU' },
    update: {},
    create: {
      name: 'Guru Gobind Singh Indraprastha University',
      shortCode: 'GGSIPU',
    },
  });

  // --- Courses: one ACTIVE (B.Tech), several COMING_SOON across categories
  // (Part 3 §3: "Engineering / Commerce / Science / Design / Law /
  // Medicine clusters") ---
  const courseSeeds = [
    {
      name: 'B.Tech',
      slug: 'btech',
      category: 'Engineering',
      status: 'ACTIVE' as const,
      displayOrder: 1,
    },
    {
      name: 'BBA',
      slug: 'bba',
      category: 'Commerce',
      status: 'COMING_SOON' as const,
      displayOrder: 2,
    },
    {
      name: 'B.Com (Hons)',
      slug: 'bcom-hons',
      category: 'Commerce',
      status: 'COMING_SOON' as const,
      displayOrder: 3,
    },
    {
      name: 'BCA',
      slug: 'bca',
      category: 'Science',
      status: 'COMING_SOON' as const,
      displayOrder: 4,
    },
    {
      name: 'B.Sc (Hons) Mathematics',
      slug: 'bsc-hons-mathematics',
      category: 'Science',
      status: 'COMING_SOON' as const,
      displayOrder: 5,
    },
    {
      name: 'B.Arch',
      slug: 'barch',
      category: 'Design',
      status: 'COMING_SOON' as const,
      displayOrder: 6,
    },
    {
      name: 'B.Des',
      slug: 'bdes',
      category: 'Design',
      status: 'COMING_SOON' as const,
      displayOrder: 7,
    },
    {
      name: 'BA LLB',
      slug: 'ballb',
      category: 'Law',
      status: 'COMING_SOON' as const,
      displayOrder: 8,
    },
    {
      name: 'MBBS',
      slug: 'mbbs',
      category: 'Medicine',
      status: 'COMING_SOON' as const,
      displayOrder: 9,
    },
    {
      name: 'BAMS',
      slug: 'bams',
      category: 'Medicine',
      status: 'COMING_SOON' as const,
      displayOrder: 10,
    },
  ];

  const coursesBySlug = new Map<string, { id: string }>();
  for (const seed of courseSeeds) {
    const course = await prisma.course.upsert({
      where: { slug: seed.slug },
      update: {
        name: seed.name,
        category: seed.category,
        status: seed.status,
        displayOrder: seed.displayOrder,
      },
      create: { ...seed, universityId: university.id, createdById: admin.id },
    });
    coursesBySlug.set(seed.slug, course);
  }
  const btech = coursesBySlug.get('btech')!;

  // --- Branches under B.Tech: three ACTIVE (Part 3 §4's named trio), three COMING_SOON ---
  const branchSeeds = [
    {
      name: 'AI & Data Science',
      slug: 'ai-ds',
      description: 'Artificial Intelligence and Data Science specialization.',
      status: 'ACTIVE' as const,
      displayOrder: 1,
    },
    {
      name: 'AI & Machine Learning',
      slug: 'ai-ml',
      description: 'Artificial Intelligence and Machine Learning specialization.',
      status: 'ACTIVE' as const,
      displayOrder: 2,
    },
    {
      name: 'IIoT',
      slug: 'iiot',
      description: 'Industrial Internet of Things specialization.',
      status: 'ACTIVE' as const,
      displayOrder: 3,
    },
    {
      name: 'Computer Science Engineering',
      slug: 'cse',
      description: 'Core Computer Science Engineering.',
      status: 'COMING_SOON' as const,
      displayOrder: 4,
    },
    {
      name: 'Information Technology',
      slug: 'it',
      description: 'Information Technology.',
      status: 'COMING_SOON' as const,
      displayOrder: 5,
    },
    {
      name: 'Electronics & Communication',
      slug: 'ece',
      description: 'Electronics and Communication Engineering.',
      status: 'COMING_SOON' as const,
      displayOrder: 6,
    },
  ];

  const branchesBySlug = new Map<string, { id: string }>();
  for (const seed of branchSeeds) {
    const branch = await prisma.branch.upsert({
      where: { slug: seed.slug },
      update: {
        name: seed.name,
        description: seed.description,
        status: seed.status,
        displayOrder: seed.displayOrder,
      },
      create: { ...seed, courseId: btech.id, createdById: admin.id },
    });
    branchesBySlug.set(seed.slug, branch);
  }
  const aiDs = branchesBySlug.get('ai-ds')!;

  // --- Semesters: global lookup, Semester 1-6 + Placement track (Part 3 §5: "(1-6 + Placement)") ---
  const semesterSeeds = [
    { label: 'Semester 1', displayOrder: 1, isPlacementTrack: false },
    { label: 'Semester 2', displayOrder: 2, isPlacementTrack: false },
    { label: 'Semester 3', displayOrder: 3, isPlacementTrack: false },
    { label: 'Semester 4', displayOrder: 4, isPlacementTrack: false },
    { label: 'Semester 5', displayOrder: 5, isPlacementTrack: false },
    { label: 'Semester 6', displayOrder: 6, isPlacementTrack: false },
    { label: 'Internship & Placement', displayOrder: 7, isPlacementTrack: true },
  ];

  const semestersByLabel = new Map<string, { id: string }>();
  for (const seed of semesterSeeds) {
    // Semester has no unique column of its own (Phase 2 schema, locked) —
    // idempotency here is an explicit existence check rather than a
    // native Prisma `upsert`.
    let semester = await prisma.semester.findFirst({ where: { label: seed.label } });
    if (!semester) {
      semester = await prisma.semester.create({ data: seed });
    } else if (
      semester.displayOrder !== seed.displayOrder ||
      semester.isPlacementTrack !== seed.isPlacementTrack
    ) {
      semester = await prisma.semester.update({
        where: { id: semester.id },
        data: { displayOrder: seed.displayOrder, isPlacementTrack: seed.isPlacementTrack },
      });
    }
    semestersByLabel.set(seed.label, semester);
  }
  const semester3 = semestersByLabel.get('Semester 3')!;
  const semester4 = semestersByLabel.get('Semester 4')!;

  // --- Subjects: real content for AI & DS, Semesters 3-4 only (Part 3's "content-depth-driven" v1) ---
  const subjectSeeds = [
    {
      name: 'Data Structures & Algorithms',
      code: 'DSA-301',
      description: 'Core data structures and algorithmic techniques.',
      aliases: ['DSA'],
      semester: semester3,
    },
    {
      name: 'Discrete Mathematics',
      code: 'DM-302',
      description: 'Mathematical foundations for computer science.',
      aliases: ['Discrete Maths'],
      semester: semester3,
    },
    {
      name: 'Database Management Systems',
      code: 'DBMS-401',
      description: 'Relational database design, SQL, and transactions.',
      aliases: ['DBMS'],
      semester: semester4,
    },
    {
      name: 'Operating Systems',
      code: 'OS-402',
      description: 'Processes, memory management, and concurrency.',
      aliases: ['OS'],
      semester: semester4,
    },
    {
      name: 'Machine Learning Fundamentals',
      code: 'ML-403',
      description: 'Introduction to supervised and unsupervised learning.',
      aliases: ['ML'],
      semester: semester4,
    },
  ];

  for (const seed of subjectSeeds) {
    const subject = await prisma.subject.upsert({
      where: { code: seed.code },
      update: { name: seed.name, description: seed.description, aliases: seed.aliases },
      create: {
        name: seed.name,
        code: seed.code,
        description: seed.description,
        aliases: seed.aliases,
        createdById: admin.id,
      },
    });

    await prisma.branchSemesterSubject.upsert({
      where: {
        branchId_semesterId_subjectId: {
          branchId: aiDs.id,
          semesterId: seed.semester.id,
          subjectId: subject.id,
        },
      },
      update: {},
      create: {
        branchId: aiDs.id,
        semesterId: seed.semester.id,
        subjectId: subject.id,
        createdById: admin.id,
      },
    });
  }

  // --- Denormalized subjectCount on Branch (Phase 2 §9's sanctioned cache) ---
  const aiDsSubjectCount = await prisma.branchSemesterSubject.count({
    where: { branchId: aiDs.id, archivedAt: null },
  });
  await prisma.branch.update({
    where: { id: aiDs.id },
    data: { subjectCount: aiDsSubjectCount },
  });

  console.log('Seed complete.');
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
