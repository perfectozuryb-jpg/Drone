import { z } from "zod";

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const droneModelSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  level: z.string().min(1),
  useCases: z.array(z.string().min(1)).min(1),
  learningOutcomes: z.array(z.string().min(1)).min(1),
  specs: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })),
  image: z.string().min(1),
  featured: z.boolean(),
});

export const curriculumItemSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  level: z.string().min(1),
  format: z.string().min(1),
  summary: z.string().min(1),
  modules: z.array(z.string().min(1)).min(1),
  outcomes: z.array(z.string().min(1)).min(1),
  status: z.string().min(1),
  downloadLabel: z.string().min(1),
});

export const serviceSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  deliverables: z.array(z.string().min(1)).min(1),
  audience: z.array(z.string().min(1)).min(1),
  ctaLabel: z.string().min(1),
});

export const partnerSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  summary: z.string().min(1),
});

export const siteContentSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    description: z.string().min(1),
  }),
  navigation: z.array(linkSchema).min(1),
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    primaryCta: linkSchema,
    secondaryCta: linkSchema,
    metrics: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })),
  }),
  audiencePaths: z.array(
    z.object({
      name: z.string().min(1),
      summary: z.string().min(1),
      href: z.string().min(1),
    }),
  ),
  process: z.array(
    z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
    }),
  ),
});

export const sourceContentSchema = z.object({
  site: siteContentSchema,
  drones: z.array(droneModelSchema).min(1),
  curriculum: z.array(curriculumItemSchema).min(1),
  services: z.array(serviceSchema).min(1),
  partners: z.array(partnerSchema).min(1),
});

export const articleFrontmatterSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  summary: z.string().min(1),
  category: z.string().min(1),
  readingTime: z.string().min(1),
});

export const articleSchema = articleFrontmatterSchema.extend({
  content: z.string().min(1),
});

export type DroneModel = z.infer<typeof droneModelSchema>;
export type CurriculumItem = z.infer<typeof curriculumItemSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Partner = z.infer<typeof partnerSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;
export type SourceContent = z.infer<typeof sourceContentSchema>;
export type Article = z.infer<typeof articleSchema>;
export type ArticleSummary = z.infer<typeof articleFrontmatterSchema>;

