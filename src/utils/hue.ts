import { siteConfig } from "@/config";

// 存储色相时同时记录其所基于的配置色相。旧版本会把配置默认值无条件写入
// localStorage，配置色相变更后老访客会一直读到旧值；有基线记录后，
// 凡不是基于当前配置存入的值一律视为过期，让新配置默认值生效。
const HUE_BASE_KEY = "hueBase";

function configHueString(): string {
    return siteConfig.themeColor.hue.toString();
}

// Function to set hue
export function setHue(hue: number): void {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("hue", String(hue));
        localStorage.setItem(HUE_BASE_KEY, configHueString());
    }
    if (typeof document !== "undefined") {
        const r = document.querySelector(":root") as HTMLElement;
        if (!r) {
            return;
        }
        r.style.setProperty("--hue", String(hue));
    }
}

// Function to get default hue from config-carrier dataset
export function getDefaultHue(): number {
    const fallback = siteConfig.themeColor.hue.toString();
    if (typeof document !== "undefined") {
        const configCarrier = document.getElementById("config-carrier");
        return Number.parseInt(configCarrier?.dataset.hue || fallback);
    }
    return Number.parseInt(fallback);
}

// Function to get hue from local storage or default
export function getHue(): number {
    if (typeof localStorage !== "undefined") {
        const stored = localStorage.getItem("hue");
        // 仅沿用基于当前配置存入的值（用户在当前配置下的主动调整）；
        // 无基线记录的旧值是被持久化的旧默认值，直接忽略
        if (stored && localStorage.getItem(HUE_BASE_KEY) === configHueString()) {
            const parsed = Number.parseInt(stored);
            if (!Number.isNaN(parsed)) {
                return parsed;
            }
        }
    }
    return getDefaultHue();
}

// Function to initialize hue from local storage or default
export function initHue(): void {
    const hue = getHue();
    setHue(hue);
}