//// Plugin originally written for Equicord at 2026-02-16 by https://github.com/Bluscream, https://antigravity.google
// region Imports
import { Settings } from "@api/Settings";
import definePlugin from "@utils/types";
import { Menu } from "@webpack/common";
import { Logger } from "@utils/Logger";

import { settings } from "./settings";
// endregion Imports

import { pluginInfo } from "./info";
export { pluginInfo };

// region Variables
const logger = new Logger(pluginInfo.id, pluginInfo.color);

const DEV_PLUGINS = [
    "DevCompanion",
    "devcompanionExtended",
    "DiscordDevBanner",
    "F8Break",
    "Experiments",
    "NoDevtoolsWarning",
    "ConsoleJanitor",
    "ReactErrorDecoder",
    "ViewRawVariant",
    "ViewRaw"
];
// endregion Variables

// region Definition
export default definePlugin({
    name: pluginInfo.name,
    description: pluginInfo.description,
    authors: pluginInfo.authors,
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
// endregion Definition
