export const pluginInfo = {
    id: "devToggle",
    name: "Dev Toggle",
    description: "Adds a checkbox to the Equicord/Vencord toolbox to enable/disable all developer tools at once",
    color: "#7289da"
};

// Created at 2026-01-10 08:30:00

import { definePluginSettings,Settings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { Menu } from "@webpack/common";

// List of developer plugins to toggle
const DEV_PLUGINS = [
    "DevCompanion",
    "devcompanionExtended",
    "DiscordDevBanner",
    "F8Break",
    "Experiments",
    "NoDevtoolsWarning",
    // "EquicordToolbox", // this would break our enable mechanism
    "ConsoleJanitor",
    "ReactErrorDecoder",
    "ViewRawVariant",
    "ViewRaw"
];

const settings = definePluginSettings({
    devMode: {
        type: OptionType.BOOLEAN,
        description: "Enable all developer tools",
        default: false,
        restartNeeded: false
    }
});

import { Logger } from "@utils/Logger";

const logger = new Logger(pluginInfo.name, pluginInfo.color);

export default definePlugin({
    name: "Dev Toggle",
    description: "Adds a checkbox to the Equicord/Vencord toolbox to enable/disable all developer tools at once",
    authors: [
        { name: "Windsurf", id: 0n },
        { name: "Bluscream", id: 467777925790564352n },
    ],
    settings,

    toolboxActions() {
        const { devMode } = settings.use(["devMode"]);

        return (
            <Menu.MenuCheckboxItem
                id="blu-dev-toggle"
                label="Developer Mode"
                checked={devMode}
                action={() => {
                    const newState = !devMode;

                    // Update setting first
                    settings.store.devMode = newState;

                    // Enable/disable all dev plugins
                    DEV_PLUGINS.forEach(pluginName => {
                        try {
                            if (Settings.plugins[pluginName]) {
                                Settings.plugins[pluginName].enabled = newState;
                                logger.log(`${newState ? "Enabled" : "Disabled"} plugin: ${pluginName}`);
                            } else {
                                logger.warn(`Plugin ${pluginName} not found in settings`);
                            }
                        } catch (error) {
                            logger.error(`Failed to ${newState ? "enable" : "disable"} plugin ${pluginName}:`, error);
                        }
                    });

                    logger.log(`Developer mode ${newState ? "enabled" : "disabled"}. ${DEV_PLUGINS.length} plugins affected.`);
                }}
            />
        );
    },
});
