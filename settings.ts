import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    devMode: {
        type: OptionType.BOOLEAN,
        description: "Whether to enable all developer tools",
        default: false,
        restartNeeded: false
    }
});
