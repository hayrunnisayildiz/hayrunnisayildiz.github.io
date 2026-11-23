import { developer } from "./devInfo";
import { syncProjectsToFileSystem } from "./syncProjects";
import { experience, education } from "$lib/experience";

const experienceText = experience.length
  ? "\n" + experience
      .map((e) =>
        [
          `${e.role} — ${e.company}${e.location ? ` (${e.location})` : ""}`,
          `${e.dates}${e.type ? ` · ${e.type}` : ""}`,
          e.summary ? `  ${e.summary}` : "",
          ...(e.highlights ?? []).map((h) => `  • ${h}`),
          e.tools?.length ? `  Tools: ${e.tools.join(", ")}` : "",
          e.url ? `  ${e.url}` : "",
        ].filter(Boolean).join("\n")
      )
      .join("\n\n") + "\n"
  : "\nNo experience added yet.\n";

const educationText =
  "\n" +
  education
    .map((e) =>
      [
        `${e.degree} — ${e.school}${e.location ? ` (${e.location})` : ""}`,
        e.dates,
        e.note ? `  ${e.note}` : "",
      ].filter(Boolean).join("\n")
    )
    .join("\n\n") +
  "\n";

export const fileSystem: FileSystem = {
  home: {
    about: `
${developer.about}

Programming Languages:
${developer.code.join(", ")}

Operating Systems:
${developer.operatingSystems.join(", ")}

Tools Used:
${developer.toolsUsed.join(", ")}

IDEs:
${developer.ides.join(", ")}
    `,
    ...(experience.length ? { experience: experienceText } : {}),
    ...(education.length ? { education: educationText } : {}),
    projects: {},
    interests: `
${developer.interests.join("\n")}
    `,
  },
};

syncProjectsToFileSystem(fileSystem);

export interface FileSystem {
  [key: string]: string | FileSystem;
}
