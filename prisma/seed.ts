import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Privitty CMS Database Seed...");

  // 1. Seed or Update Admin User
  const adminEmail = (process.env.ADMIN_INITIAL_EMAIL || "admin@privitty.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "PrivittyAdmin2026!#";
  const adminName = process.env.ADMIN_INITIAL_NAME || "Privitty Security Admin";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      isActive: true,
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log(`✅ Admin user verified: ${admin.email}`);

  // 2. Seed Testimonials (Preserving exact homepage copy & media)
  const testimonialsData = [
    {
      authorName: "Industrial Automation Consortium",
      jobTitle: "Industry Partner",
      companyName: "Industrial Automation Consortium",
      quote:
        "Their identity-first approach helped us eliminate VPN Complexity and move faster with verified access, streamlining our deployments, improving security posture, and delivering outcomes we couldn't reach before.",
      rating: 5,
      authorPortrait: "/industrial-partner.jpg",
      displayOrder: 1,
      isPublished: true,
      isFeatured: true,
    },
    {
      authorName: "Leading OEM",
      jobTitle: "Ongoing Partner",
      companyName: "Leading OEM",
      quote:
        "Their team helped us identify critical gaps in remote access, then deployed tools that improved both our speed and traceability.",
      rating: 5,
      authorPortrait: "/testimonials/leading-oem.png",
      displayOrder: 2,
      isPublished: true,
      isFeatured: false,
    },
    {
      authorName: "Pankaj Garg",
      jobTitle: "CEO",
      companyName: "CoreIC",
      quote:
        "We needed zero-trust remote access, and they nailed it. Every step was collaborative, transparent, and focused on securing the right outcome for us.",
      rating: 5,
      authorPortrait: "/testimonials/pankaj-garg.png",
      displayOrder: 3,
      isPublished: true,
      isFeatured: false,
    },
    {
      authorName: "Dr. Santosh Honnagunti",
      jobTitle: "CEO",
      companyName: "Tayana Mobility",
      quote:
        "From onboarding to live deployment, they were incredibly proactive and sharp. Our new identity-verified access layer reduced manual overhead.",
      rating: 5,
      authorPortrait: "/testimonials/santosh-honnagunti.png",
      displayOrder: 4,
      isPublished: true,
      isFeatured: false,
    },
  ];

  for (const t of testimonialsData) {
    const existing = await prisma.testimonial.findFirst({
      where: {
        authorName: t.authorName,
        companyName: t.companyName,
      },
    });

    if (!existing) {
      await prisma.testimonial.create({
        data: t,
      });
      console.log(`  + Seeded testimonial: ${t.authorName} (${t.companyName})`);
    }
  }

  // 3. Seed Team Members (Preserving exact About page team members and LinkedIn URLs)
  const teamMembersData = [
    {
      name: "Milind Deore",
      jobTitle: "CEO",
      bio: "Founding visionary leading Privitty's mission to redefine identity-first OT critical infrastructure protection.",
      photoUrl: "/milind.png",
      linkedinUrl: "https://www.linkedin.com/in/mdeore/",
      displayOrder: 1,
      isPublished: true,
    },
    {
      name: "Ashish Gupta",
      jobTitle: "COO",
      bio: "Operations and industrial security practitioner orchestrating enterprise deployments and sovereign compliance.",
      photoUrl: "/ashish.png",
      linkedinUrl: "https://www.linkedin.com/in/ashish-gupta-a860611a/",
      displayOrder: 2,
      isPublished: true,
    },
    {
      name: "Girish Jadhav",
      jobTitle: "Mobile App Developer",
      bio: "Specializing in zero-knowledge client architectures, cross-platform mobile security, and swift cryptographic UX.",
      photoUrl: "/girish.png",
      linkedinUrl: "https://www.linkedin.com/in/girish-jadhav-4125772a5/",
      displayOrder: 3,
      isPublished: true,
    },
    {
      name: "Sourav Soni",
      jobTitle: "Full Stack Developer",
      bio: "Architecting cloud-native distributed backends, web frontends, and automated high-throughput secure tunnels.",
      photoUrl: "/sourav.png",
      linkedinUrl: "https://www.linkedin.com/in/souraviously",
      displayOrder: 4,
      isPublished: true,
    },
    {
      name: "Tejas Sharma",
      jobTitle: "Software Engineer",
      bio: "Core protocol engineer building resilient sovereign relays, low-latency packet inspection, and edge daemons.",
      photoUrl: "/tejas.png",
      linkedinUrl: "https://www.linkedin.com/in/tejassharmaaa/",
      displayOrder: 5,
      isPublished: true,
    },
    {
      name: "Prof. (Dr.) S. R. Dhore",
      jobTitle: "Advisor",
      bio: "Senior academic and cryptographic advisor guiding formal verification, zero-trust protocols, and algorithmic rigor.",
      photoUrl: "/dr-dhore.png",
      linkedinUrl: "https://in.linkedin.com/in/prof-dr-sunil-dhore-70274315",
      displayOrder: 6,
      isPublished: true,
    },
  ];

  for (const m of teamMembersData) {
    const existing = await prisma.teamMember.findFirst({
      where: { name: m.name },
    });

    if (!existing) {
      await prisma.teamMember.create({
        data: m,
      });
      console.log(`  + Seeded team member: ${m.name} (${m.jobTitle})`);
    }
  }

  // 4. Seed Initial Whitepaper
  const whitepapersData = [
    {
      title: "Identity-First Architecture for Zero-Trust Operational Technology",
      slug: "identity-first-zero-trust-ot",
      shortDescription:
        "A technical architectural blueprint for eliminating VPN vulnerabilities and establishing hardware-free cryptographic machine identities across industrial edge networks.",
      longDescription:
        "Operational Technology (OT) networks require deterministic machine access without the vulnerabilities of shared network-layer VPN perimeters. This technical paper details Privitty's identity governance, sovereign cryptographic relays, ephemeral access leases, and zero-trust verification model designed specifically for high-consequence industrial facilities.",
      coverImageUrl: "/preview.png",
      fileKey: "whitepapers/privitty-identity-first-ot-architecture.pdf",
      fileName: "Privitty-Identity-First-OT-Whitepaper.pdf",
      fileSize: 1024 * 1024 * 2, // 2MB
      category: "Security Architecture",
      author: "Privitty Security Research",
      displayOrder: 1,
      isPublished: true,
      downloadCount: 142,
    },
    {
      title: "Eliminating Lateral Movement in ICS/SCADA Networks",
      slug: "eliminating-lateral-movement-scada",
      shortDescription:
        "How cryptographic micro-segmentation and per-session tokens prevent adversaries from pivoting between IT and OT segments.",
      longDescription:
        "Industrial control networks are frequently breached through compromised IT workstations that pivot across flat VPN tunnels. This paper demonstrates mathematical proof and field measurements of hardware-free micro-segmentation preventing lateral movement across SCADA controllers.",
      coverImageUrl: "/preview.png",
      fileKey: "whitepapers/privitty-scada-lateral-movement-defense.pdf",
      fileName: "Privitty-SCADA-Lateral-Movement-Defense.pdf",
      fileSize: 1024 * 1024 * 3, // 3MB
      category: "Threat Defense",
      author: "Privitty Threat Intelligence",
      displayOrder: 2,
      isPublished: true,
      downloadCount: 89,
    },
  ];

  for (const wp of whitepapersData) {
    const existing = await prisma.whitepaper.findUnique({
      where: { slug: wp.slug },
    });

    if (!existing) {
      await prisma.whitepaper.create({
        data: wp,
      });
      console.log(`  + Seeded whitepaper: ${wp.title}`);
    }
  }

  // 5. Seed Partners
  const partnersData = [
    {
      companyName: "Industrial Automation Consortium",
      logoUrl: "/partners/iac.svg",
      websiteUrl: "https://privitty.com",
      displayOrder: 1,
      isPublished: true,
    },
    {
      companyName: "CoreIC Semiconductors",
      logoUrl: "/partners/coreic.svg",
      websiteUrl: "https://privitty.com",
      displayOrder: 2,
      isPublished: true,
    },
    {
      companyName: "Tayana Mobility",
      logoUrl: "/partners/tayana.svg",
      websiteUrl: "https://privitty.com",
      displayOrder: 3,
      isPublished: true,
    },
    {
      companyName: "Apex OEM Robotics",
      logoUrl: "/partners/apex-oem.svg",
      websiteUrl: "https://privitty.com",
      displayOrder: 4,
      isPublished: true,
    },
    {
      companyName: "Regional Power Grid",
      logoUrl: "/partners/gridsec.svg",
      websiteUrl: "https://privitty.com",
      displayOrder: 5,
      isPublished: true,
    },
    {
      companyName: "InnoSCADA Systems",
      logoUrl: "/partners/innoscada.svg",
      websiteUrl: "https://privitty.com",
      displayOrder: 6,
      isPublished: true,
    },
  ];

  for (const p of partnersData) {
    const existing = await prisma.partner.findFirst({
      where: { companyName: p.companyName },
    });

    if (!existing) {
      await prisma.partner.create({
        data: p,
      });
      console.log(`  + Seeded partner: ${p.companyName}`);
    }
  }

  // 6. Seed initial system audit log
  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminEmail: admin.email,
      action: "INITIAL_SEED",
      targetType: "SYSTEM",
      targetId: "system_init",
      details: JSON.stringify({
        message: "Initial CMS database seed executed successfully.",
        seededAt: new Date().toISOString(),
      }),
      ipAddress: "127.0.0.1",
      userAgent: "Privitty-CMS-Seed-Script/1.0",
    },
  });

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
