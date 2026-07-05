import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  getCurriculumItems,
  getDroneModels,
  getServices,
  getSiteContent,
} from "@/lib/content";
import { CurriculumCard } from "./curriculum-card";
import { DroneCard } from "./drone-card";
import { LabVisual } from "./lab-visual";
import { ServiceCard } from "./service-card";
import { SiteHeader } from "./site-header";

describe("shared site components", () => {
  it("renders navigation and the primary solution CTA", () => {
    const site = getSiteContent();

    render(
      <SiteHeader
        brandName={site.brand.name}
        navigation={site.navigation}
        primaryCta={site.hero.primaryCta}
      />,
    );

    expect(screen.getByRole("link", { name: "Drone Việt" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen
        .getAllByRole("link", { name: "Giải pháp" })
        .some((link) => link.getAttribute("href") === "/giai-phap"),
    ).toBe(true);
    expect(
      screen
        .getAllByRole("link", { name: "Sản phẩm" })
        .some((link) => link.getAttribute("href") === "/san-pham"),
    ).toBe(true);
    expect(
      screen.getByRole("link", { name: "Liên hệ tư vấn ngay" }),
    ).toHaveAttribute("href", "https://zalo.me/0384070636");
    expect(
      screen.getByRole("link", { name: "Liên hệ tư vấn ngay" }),
    ).toHaveAttribute("target", "_blank");
  });

  it("renders featured drone, curriculum, service, and lab visual cards", () => {
    const site = getSiteContent();
    const drone = getDroneModels()[0];
    const curriculum = getCurriculumItems()[0];
    const service = getServices()[0];

    render(
      <>
        <LabVisual metrics={site.hero.metrics} />
        <DroneCard drone={drone} />
        <CurriculumCard item={curriculum} />
        <ServiceCard service={service} />
      </>,
    );

    expect(screen.getByText("Lab telemetry")).toBeInTheDocument();
    expect(screen.getByText("DV Primary Lab")).toBeInTheDocument();
    expect(
      screen.getByText("Drone nhập môn cho cấp 1"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Tư vấn phòng lab drone nghiên cứu & giáo dục"),
    ).toBeInTheDocument();
  });
});
