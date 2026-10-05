import config from "./playwright.config";
const previewConfig = { ...config, use: { ...config.use, baseURL: "http://127.0.0.1:3006" }, projects: config.projects?.map(project => ({ ...project, use: { ...project.use, channel: "msedge" } })), webServer: undefined };
export default previewConfig;
