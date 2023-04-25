
// Shiet bruh, vendetta has no documentation, these code originated from
// https://github.com/aeongdesu/vdplugins/tree/main/plugins/ViewRaw
// with modification to only add one button for copy user id when long message press.

import { before, after } from "@vendetta/patcher"
import { getAssetIDByName as getAssetId } from "@vendetta/ui/assets"
import { findByProps as getByProps, findByName } from "@vendetta/metro"
import { React, ReactNative, constants as Constants, clipboard } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
// import RawPage from "./RawPage"

const ActionSheet = getByProps("openLazy", "hideActionSheet")
const Navigation = getByProps("push", "pushLazy", "pop")
const DiscordNavigator = getByProps("getRenderCloseButton")
const { default: Navigator, getRenderCloseButton } = DiscordNavigator
const Icon = findByName("Icon")
const { FormRow } = Forms
import { showToast } from "@vendetta/ui/toasts"

const unpatch = before("openLazy", ActionSheet, (ctx) => {
    const [component, args, actionMessage] = ctx
    if (args !== "MessageLongPressActionSheet") return
    component.then(instance => {
        const unpatch = after("default", instance, (_, component) => {
            React.useEffect(() => () => { unpatch() }, []) // omg!!!!!!!!!!!!!
            let [msgProps, buttons] = component.props?.children?.props?.children?.props?.children

            const message = msgProps?.props?.message ?? actionMessage?.message


            if (!buttons || !message) return
            console.log(message);
            buttons.push(
                <FormRow
                    label="Copy User Id"
                    leading={<Icon source={getAssetId("ic_chat_bubble_16px")} />}
                    onPress={() => {
                        ActionSheet.hideActionSheet()
                        vendetta.metro.common.clipboard.setString(message?.author?.id ?? '')
                        showToast("Copied User ID to clipboard", getAssetId("toast_copy_link"))
                    }}
                />)
        })
    })
})

export const onUnload = () => unpatch()
