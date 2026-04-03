import { defaultSiteContent, type SiteContent } from "@/data/site-content";

const DEFAULT_BRANCH = "main";
const DEFAULT_CONTENT_PATH = "data/site-content.json";

type GithubFileResponse = {
  sha: string;
};

type GithubCmsConfig = {
  owner: string;
  repo: string;
  branch: string;
  contentPath: string;
  token: string;
  adminSecret: string;
};

export type CmsStatus = {
  readEnabled: boolean;
  writeEnabled: boolean;
  hasAdminSecret: boolean;
  repoLabel: string;
  branch: string;
  contentPath: string;
};

function getGithubCmsConfig(): GithubCmsConfig {
  return {
    owner: process.env.GITHUB_REPO_OWNER?.trim() ?? "",
    repo: process.env.GITHUB_REPO_NAME?.trim() ?? "",
    branch: process.env.GITHUB_REPO_BRANCH?.trim() || DEFAULT_BRANCH,
    contentPath: process.env.GITHUB_CONTENT_PATH?.trim() || DEFAULT_CONTENT_PATH,
    token: process.env.GITHUB_TOKEN?.trim() ?? "",
    adminSecret: process.env.CMS_ADMIN_SECRET?.trim() ?? ""
  };
}

function encodeContentPath(contentPath: string) {
  return contentPath
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function getContentsApiUrl(config: GithubCmsConfig) {
  const encodedPath = encodeContentPath(config.contentPath);
  return `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodedPath}`;
}

function getCommonHeaders(token?: string) {
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isSiteContent(value: unknown): value is SiteContent {
  if (!isRecord(value)) {
    return false;
  }

  const requiredKeys = ["site", "navigation", "hero", "about", "services", "projects", "resume", "blog", "contact"];
  return requiredKeys.every((key) => key in value);
}

export function getCmsStatus(): CmsStatus {
  const config = getGithubCmsConfig();
  const readEnabled = Boolean(config.owner && config.repo);
  const writeEnabled = Boolean(readEnabled && config.token);

  return {
    readEnabled,
    writeEnabled,
    hasAdminSecret: Boolean(config.adminSecret),
    repoLabel: readEnabled ? `${config.owner}/${config.repo}` : "Not configured",
    branch: config.branch,
    contentPath: config.contentPath
  };
}

export async function readGithubSiteContent(): Promise<SiteContent | null> {
  const config = getGithubCmsConfig();

  if (!config.owner || !config.repo) {
    return null;
  }

  try {
    const response = await fetch(`${getContentsApiUrl(config)}?ref=${encodeURIComponent(config.branch)}`, {
      cache: "no-store",
      headers: {
        ...getCommonHeaders(config.token),
        Accept: "application/vnd.github.raw+json"
      }
    });

    if (!response.ok) {
      console.warn(`CMS read failed with status ${response.status}. Falling back to bundled content.`);
      return null;
    }

    const payload = (await response.json()) as unknown;

    if (!isSiteContent(payload)) {
      console.warn("CMS read returned invalid content. Falling back to bundled content.");
      return null;
    }

    return payload;
  } catch (error) {
    console.warn("CMS read failed. Falling back to bundled content.", error);
    return null;
  }
}

export async function writeGithubSiteContent(content: SiteContent, secret: string, message?: string) {
  const config = getGithubCmsConfig();

  if (!config.owner || !config.repo || !config.token) {
    throw new Error("GitHub CMS is not fully configured.");
  }

  if (!config.adminSecret) {
    throw new Error("CMS_ADMIN_SECRET is missing.");
  }

  if (secret !== config.adminSecret) {
    throw new Error("Invalid admin secret.");
  }

  if (!isSiteContent(content)) {
    throw new Error("The submitted content is not valid.");
  }

  const apiUrl = getContentsApiUrl(config);
  const metadataResponse = await fetch(`${apiUrl}?ref=${encodeURIComponent(config.branch)}`, {
    cache: "no-store",
    headers: getCommonHeaders(config.token)
  });

  let existingFile: GithubFileResponse | null = null;

  if (metadataResponse.ok) {
    existingFile = (await metadataResponse.json()) as GithubFileResponse;
  } else if (metadataResponse.status !== 404) {
    throw new Error(`Unable to load the current content file. GitHub returned ${metadataResponse.status}.`);
  }

  const serializedContent = `${JSON.stringify(content, null, 2)}\n`;
  const updateResponse = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      ...getCommonHeaders(config.token),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: message?.trim() || "Update website content from CMS",
      content: Buffer.from(serializedContent, "utf8").toString("base64"),
      branch: config.branch,
      sha: existingFile?.sha
    })
  });

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    throw new Error(`GitHub save failed with status ${updateResponse.status}: ${errorText}`);
  }

  const result = (await updateResponse.json()) as {
    commit?: {
      html_url?: string;
    };
    content?: {
      path?: string;
    };
  };

  return {
    commitUrl: result.commit?.html_url ?? "",
    contentPath: result.content?.path ?? config.contentPath,
    content
  };
}

export function getBundledSiteContent() {
  return defaultSiteContent;
}
